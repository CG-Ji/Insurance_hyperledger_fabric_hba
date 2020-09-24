
CHANNEL_NAME="$1"
CC_SRC_LANGUAGE="$2"
VERSION="$3"
DELAY="$4"
MAX_RETRY="$5"
VERBOSE="$6"
: ${CHANNEL_NAME:="mychannel"}
#: ${CC_SRC_LANGUAGE:="golang"}
: ${CC_SRC_LANGUAGE:="node"}
: ${VERSION:="1"}
: ${DELAY:="3"}
: ${MAX_RETRY:="5"}
: ${VERBOSE:="false"}
CC_SRC_LANGUAGE=`echo "$CC_SRC_LANGUAGE" | tr [:upper:] [:lower:]`

FABRIC_CFG_PATH=$PWD/../config/

: 'if [ "$CC_SRC_LANGUAGE" = "go" -o "$CC_SRC_LANGUAGE" = "golang" ] ; then
	CC_RUNTIME_LANGUAGE=golang
	CC_SRC_PATH="../chaincode/fabcar/go/"

	echo Vendoring Go dependencies ...
	pushd ../chaincode/fabcar/go
	GO111MODULE=on go mod vendor
	popd
	echo Finished vendoring Go dependencies

elif [ "$CC_SRC_LANGUAGE" = "javascript" ]; then
	CC_RUNTIME_LANGUAGE=node # chaincode runtime language is node.js
	CC_SRC_PATH="../chaincode/"'

: 'elif [ "$CC_SRC_LANGUAGE" = "java" ]; then
	CC_RUNTIME_LANGUAGE=java
	CC_SRC_PATH="../chaincode/fabcar/java/build/install/fabcar"

	echo Compiling Java code ...
	pushd ../chaincode/fabcar/java
	./gradlew installDist
	popd
	echo Finished compiling Java code

elif [ "$CC_SRC_LANGUAGE" = "typescript" ]; then
	CC_RUNTIME_LANGUAGE=node # chaincode runtime language is node.js
	CC_SRC_PATH="../chaincode/fabcar/typescript/"

	echo Compiling TypeScript code into JavaScript ...
	pushd ../chaincode/fabcar/typescript
	npm install
	npm run build
	popd
	echo Finished compiling TypeScript code into JavaScript
'

if [ "$CC_SRC_LANGUAGE" = "javascript" ]; then
	CC_RUNTIME_LANGUAGE=node # chaincode runtime language is node.js
	CC_SRC_PATH="../chaincode/"
else
	echo The chaincode language ${CC_SRC_LANGUAGE} is not supported by this script
	echo Supported chaincode languages are: go, java, javascript, and typescript
	exit 1
fi

# import utils
. scripts/envVar.sh


packageChaincode() {
  ORG=$1
  setGlobals $ORG
  set -x
  peer lifecycle chaincode package covid-ins.tar.gz --path ${CC_SRC_PATH} --lang ${CC_RUNTIME_LANGUAGE} --label covid-ins_${VERSION} >&log.txt
  res=$?
  set +x
  cat log.txt
  verifyResult $res "Chaincode packaging on peer0.${ORG} has failed"
  echo "===================== Chaincode is packaged on peer0.${ORG} ===================== "
  echo
}

# installChaincode PEER ORG
installChaincode() {
  ORG=$1
  setGlobals $ORG
  set -x
  peer lifecycle chaincode install covid-ins.tar.gz >&log.txt
  res=$?
  set +x
  cat log.txt
  verifyResult $res "Chaincode installation on peer0.${ORG} has failed"
  echo "===================== Chaincode is installed on peer0.${ORG} ===================== "
  echo
}

# queryInstalled PEER ORG
queryInstalled() {
  ORG=$1
  setGlobals $ORG
  set -x
  peer lifecycle chaincode queryinstalled >&log.txt
  res=$?
  set +x
  cat log.txt
	PACKAGE_ID=$(sed -n "/covid-ins_${VERSION}/{s/^Package ID: //; s/, Label:.*$//; p;}" log.txt)
  verifyResult $res "Query installed on peer0.${ORG} has failed"
  echo "===================== Query installed successful on peer0.${ORG} on channel ===================== "
  echo
}

# approveForMyOrg VERSION PEER ORG
approveForMyOrg() {
  ORG=$1
  setGlobals $ORG
  set -x
  peer lifecycle chaincode approveformyorg -o localhost:7050 --ordererTLSHostnameOverride orderer.covid-ins.com --tls --cafile $ORDERER_CA --channelID $CHANNEL_NAME --name covid-ins --version ${VERSION} --init-required --package-id ${PACKAGE_ID} --sequence ${VERSION} >&log.txt
  set +x
  cat log.txt
  verifyResult $res "Chaincode definition approved on peer0.${ORG} on channel '$CHANNEL_NAME' failed"
  echo "===================== Chaincode definition approved on peer0.${ORG} on channel '$CHANNEL_NAME' ===================== "
  echo
}

# checkCommitReadiness VERSION PEER ORG
checkCommitReadiness() {
  ORG=$1
  shift 1
  setGlobals $ORG
  echo "===================== Checking the commit readiness of the chaincode definition on peer0.${ORG} on channel '$CHANNEL_NAME'... ===================== "
	local rc=1
	local COUNTER=1
	# continue to poll
  # we either get a successful response, or reach MAX RETRY
	while [ $rc -ne 0 -a $COUNTER -lt $MAX_RETRY ] ; do
    sleep $DELAY
    echo "Attempting to check the commit readiness of the chaincode definition on peer0.${ORG}, Retry after $DELAY seconds."
    set -x
    peer lifecycle chaincode checkcommitreadiness --channelID $CHANNEL_NAME --name covid-ins --version ${VERSION} --sequence ${VERSION} --output json --init-required >&log.txt
    res=$?
    set +x
    let rc=0
    for var in "$@"
    do
      grep "$var" log.txt &>/dev/null || let rc=1
    done
		COUNTER=$(expr $COUNTER + 1)
	done
  cat log.txt
  if test $rc -eq 0; then
    echo "===================== Checking the commit readiness of the chaincode definition successful on peer0.${ORG} on channel '$CHANNEL_NAME' ===================== "
  else
    echo "!!!!!!!!!!!!!!! After $MAX_RETRY attempts, Check commit readiness result on peer0.${ORG} is INVALID !!!!!!!!!!!!!!!!"
    echo
    exit 1
  fi
}

# commitChaincodeDefinition VERSION PEER ORG (PEER ORG)...
commitChaincodeDefinition() {
  parsePeerConnectionParameters $@
  res=$?
  verifyResult $res "Invoke transaction failed on channel '$CHANNEL_NAME' due to uneven number of peer and org parameters "

  # while 'peer chaincode' command can get the orderer endpoint from the
  # peer (if join was successful), let's supply it directly as we know
  # it using the "-o" option
  set -x
  peer lifecycle chaincode commit -o localhost:7050 --ordererTLSHostnameOverride orderer.covid-ins.com --tls --cafile $ORDERER_CA --channelID $CHANNEL_NAME --name covid-ins $PEER_CONN_PARMS --version ${VERSION} --sequence ${VERSION} --init-required >&log.txt
  res=$?
  set +x
  cat log.txt
  verifyResult $res "Chaincode definition commit failed on peer0.${ORG} on channel '$CHANNEL_NAME' failed"
  echo "===================== Chaincode definition committed on channel '$CHANNEL_NAME' ===================== "
  echo
}

# queryCommitted ORG
queryCommitted() {
  ORG=$1
  setGlobals $ORG
  EXPECTED_RESULT="Version: ${VERSION}, Sequence: ${VERSION}, Endorsement Plugin: escc, Validation Plugin: vscc"
  echo "===================== Querying chaincode definition on peer0.${ORG} on channel '$CHANNEL_NAME'... ===================== "
	local rc=1
	local COUNTER=1
	# continue to poll
  # we either get a successful response, or reach MAX RETRY
	while [ $rc -ne 0 -a $COUNTER -lt $MAX_RETRY ] ; do
    sleep $DELAY
    echo "Attempting to Query committed status on peer0.${ORG}, Retry after $DELAY seconds."
    set -x
    peer lifecycle chaincode querycommitted --channelID $CHANNEL_NAME --name covid-ins >&log.txt
    res=$?
    set +x
		test $res -eq 0 && VALUE=$(cat log.txt | grep -o '^Version: [0-9], Sequence: [0-9], Endorsement Plugin: escc, Validation Plugin: vscc')
    test "$VALUE" = "$EXPECTED_RESULT" && let rc=0
		COUNTER=$(expr $COUNTER + 1)
	done
  echo
  cat log.txt
  if test $rc -eq 0; then
    echo "===================== Query chaincode definition successful on peer0.${ORG} on channel '$CHANNEL_NAME' ===================== "
		echo
  else
    echo "!!!!!!!!!!!!!!! After $MAX_RETRY attempts, Query chaincode definition result on peer0.${ORG} is INVALID !!!!!!!!!!!!!!!!"
    echo
    exit 1
  fi
}

chaincodeInvokeInit() {
  parsePeerConnectionParameters $@
  res=$?
  verifyResult $res "Invoke transaction failed on channel '$CHANNEL_NAME' due to uneven number of peer and org parameters "

  # while 'peer chaincode' command can get the orderer endpoint from the
  # peer (if join was successful), let's supply it directly as we know
  # it using the "-o" option
  set -x
  peer chaincode invoke -o localhost:7050 --ordererTLSHostnameOverride orderer.covid-ins.com --tls --cafile $ORDERER_CA -C $CHANNEL_NAME -n covid-ins $PEER_CONN_PARMS --isInit -c '{"function":"initLedger","Args":[]}' >&log.txt
  res=$?
  set +x
  cat log.txt
  verifyResult $res "Invoke execution on $PEERS failed "
  echo "===================== Invoke transaction successful on $PEERS on channel '$CHANNEL_NAME' ===================== "
  echo
}

chaincodeQuery() {
  ORG=$1
  setGlobals $ORG
  echo "===================== Querying on peer0.${ORG} on channel '$CHANNEL_NAME'... ===================== "
	local rc=1
	local COUNTER=1
	# continue to poll
  # we either get a successful response, or reach MAX RETRY
	while [ $rc -ne 0 -a $COUNTER -lt $MAX_RETRY ] ; do
    sleep $DELAY
    echo "Attempting to Query peer0.${ORG}, Retry after $DELAY seconds."
    set -x
    peer chaincode query -C $CHANNEL_NAME -n covid-ins -c '{"Args":["queryAllContractInsurance"]}' >&log.txt
    res=$?
    set +x
		let rc=$res
		COUNTER=$(expr $COUNTER + 1)
	done
  echo
  cat log.txt
  if test $rc -eq 0; then
    echo "===================== Query successful on peer0.${ORG} on channel '$CHANNEL_NAME' ===================== "
		echo
  else
    echo "!!!!!!!!!!!!!!! After $MAX_RETRY attempts, Query result on peer0.${ORG} is INVALID !!!!!!!!!!!!!!!!"
    echo
    exit 1
  fi
}

# at first we package the chaincode
 packageChaincode insurance

# Install chaincode on peer0.insurance and peer0.hospital
 echo "Installing chaincode on peer0.insurance..."
 installChaincode insurance
 echo "Install chaincode on peer0.hospital..."
 installChaincode hospital
 echo "Install chaincode on peer0.customer..."
 installChaincode customer

# query whether the chaincode is installed
 queryInstalled insurance

# approve the definition for insurance
 approveForMyOrg insurance

# check whether the chaincode definition is ready to be committed
 checkCommitReadiness insurance "\"InsuranceMSP\": true" "\"HospitalMSP\": false" "\"CustomerMSP\": false"
 checkCommitReadiness hospital "\"InsuranceMSP\": true" "\"HospitalMSP\": false" "\"CustomerMSP\": false"
 checkCommitReadiness customer "\"InsuranceMSP\": true" "\"HospitalMSP\": false" "\"CustomerMSP\": false"

# now approve also for hospital
 approveForMyOrg hospital

# check whether the chaincode definition is ready to be committed
 checkCommitReadiness insurance "\"InsuranceMSP\": true" "\"HospitalMSP\": true" "\"CustomerMSP\": false"
 checkCommitReadiness hospital "\"InsuranceMSP\": true" "\"HospitalMSP\": true" "\"CustomerMSP\": false"
 checkCommitReadiness customer "\"InsuranceMSP\": true" "\"HospitalMSP\": true" "\"CustomerMSP\": false"

# now approve also for hospital
 approveForMyOrg customer

# check whether the chaincode definition is ready to be committed
 checkCommitReadiness insurance "\"InsuranceMSP\": true" "\"HospitalMSP\": true" "\"CustomerMSP\": true"
 checkCommitReadiness hospital "\"InsuranceMSP\": true" "\"HospitalMSP\": true" "\"CustomerMSP\": true"
 checkCommitReadiness customer "\"InsuranceMSP\": true" "\"HospitalMSP\": true" "\"CustomerMSP\": true"

# now that we know for sure both orgs have approved, commit the definition
 commitChaincodeDefinition insurance hospital customer

# query on both orgs to see that the definition committed successfully
 queryCommitted insurance
 queryCommitted hospital
 queryCommitted customer

# Invoke the chaincode
 chaincodeInvokeInit insurance hospital

## Query chaincode on peer0.insurance
echo "Querying chaincode on peer0.insurance..."
chaincodeQuery insurance

## Query chaincode on peer0.hospital
echo "Querying chaincode on peer0.hospital..."
chaincodeQuery hospital

## Query chaincode on peer0.hospital
echo "Querying chaincode on peer0.customer..."
chaincodeQuery customer

exit 0
