#
# Copyright IBM Corp All Rights Reserved
#
# SPDX-License-Identifier: Apache-2.0
#

# This is a collection of bash functions used by different scripts

export CORE_PEER_TLS_ENABLED=true
export ORDERER_CA=${PWD}/organizations/ordererOrganizations/covid-ins.com/orderers/orderer.covid-ins.com/msp/tlscacerts/tlsca.covid-ins.com-cert.pem
export PEER0_insurance_CA=${PWD}/organizations/peerOrganizations/insurance.covid-ins.com/peers/peer0.insurance.covid-ins.com/tls/ca.crt
export PEER0_hospital_CA=${PWD}/organizations/peerOrganizations/hospital.covid-ins.com/peers/peer0.hospital.covid-ins.com/tls/ca.crt
export PEER0_customer_CA=${PWD}/organizations/peerOrganizations/customer.covid-ins.com/peers/peer0.customer.covid-ins.com/tls/ca.crt

# Set OrdererOrg.Admin globals
setOrdererGlobals() {
  export CORE_PEER_LOCALMSPID="OrdererMSP"
  export CORE_PEER_TLS_ROOTCERT_FILE=${PWD}/organizations/ordererOrganizations/covid-ins.com/orderers/orderer.covid-ins.com/msp/tlscacerts/tlsca.covid-ins.com-cert.pem
  export CORE_PEER_MSPCONFIGPATH=${PWD}/organizations/ordererOrganizations/covid-ins.com/users/Admin@covid-ins.com/msp
}

# Set environment variables for the peer org
setGlobals() {
  local USING_ORG=""
  if [ -z "$OVERRIDE_ORG" ]; then
    USING_ORG=$1
  else
    USING_ORG="${OVERRIDE_ORG}"
  fi
  echo "Using organization ${USING_ORG}"
  if [ $USING_ORG = insurance ]; then
    export CORE_PEER_LOCALMSPID="InsuranceMSP"
    export CORE_PEER_TLS_ROOTCERT_FILE=$PEER0_insurance_CA
    export CORE_PEER_MSPCONFIGPATH=${PWD}/organizations/peerOrganizations/insurance.covid-ins.com/users/Admin@insurance.covid-ins.com/msp
    export CORE_PEER_ADDRESS=164.115.33.55:7051
  elif [ $USING_ORG = hospital ]; then
    export CORE_PEER_LOCALMSPID="HospitalMSP"
    export CORE_PEER_TLS_ROOTCERT_FILE=$PEER0_hospital_CA
    export CORE_PEER_MSPCONFIGPATH=${PWD}/organizations/peerOrganizations/hospital.covid-ins.com/users/Admin@hospital.covid-ins.com/msp
    export CORE_PEER_ADDRESS=164.115.33.57:9051

  elif [ $USING_ORG = customer ]; then
    export CORE_PEER_LOCALMSPID="CustomerMSP"
    export CORE_PEER_TLS_ROOTCERT_FILE=$PEER0_customer_CA
    export CORE_PEER_MSPCONFIGPATH=${PWD}/organizations/peerOrganizations/customer.covid-ins.com/users/Admin@customer.covid-ins.com/msp
    export CORE_PEER_ADDRESS=164.115.33.56:11051
  else
    echo "================== ERROR !!! ORG Unknown =================="
  fi

  if [ "$VERBOSE" == "true" ]; then
    env | grep CORE
  fi
}

# parsePeerConnectionParameters $@
# Helper function that sets the peer connection parameters for a chaincode
# operation
parsePeerConnectionParameters() {

  PEER_CONN_PARMS=""
  PEERS=""
  while [ "$#" -gt 0 ]; do
    setGlobals $1
    PEER="peer0.$1"
    ## Set peer adresses
    PEERS="$PEERS $PEER"
    PEER_CONN_PARMS="$PEER_CONN_PARMS --peerAddresses $CORE_PEER_ADDRESS"
    ## Set path to TLS certificate
    TLSINFO=$(eval echo "--tlsRootCertFiles \$PEER0_$1_CA")
    PEER_CONN_PARMS="$PEER_CONN_PARMS $TLSINFO"
    # shift by one to get to the next organization
    shift
  done
  # remove leading space for output
  PEERS="$(echo -e "$PEERS" | sed -e 's/^[[:space:]]*//')"
}

verifyResult() {
  if [ $1 -ne 0 ]; then
    echo "!!!!!!!!!!!!!!! "$2" !!!!!!!!!!!!!!!!"
    echo
    exit 1
  fi
}
