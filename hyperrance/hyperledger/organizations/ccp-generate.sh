#!/bin/bash

function one_line_pem {
    echo "`awk 'NF {sub(/\\n/, ""); printf "%s\\\\\\\n",$0;}' $1`"
}

function json_ccp {
    local PP=$(one_line_pem $5)
    local CP=$(one_line_pem $6)
    sed -e "s/\${ORG}/$1/" \
        -e "s/\${NAMEORG}/$2/" \
        -e "s/\${P0PORT}/$3/" \
        -e "s/\${CAPORT}/$4/" \
        -e "s#\${PEERPEM}#$PP#" \
        -e "s#\${CAPEM}#$CP#" \
        -e "s/\${P0IP}/$7/" \
        organizations/ccp-template.json
}

function yaml_ccp {
    local PP=$(one_line_pem $5)
    local CP=$(one_line_pem $6)
    sed -e "s/\${ORG}/$1/" \
        -e "s/\${NAMEORG}/$2/" \
        -e "s/\${P0PORT}/$3/" \
        -e "s/\${CAPORT}/$4/" \
        -e "s#\${PEERPEM}#$PP#" \
        -e "s#\${CAPEM}#$CP#" \
        -e "s/\${P0IP}/$7/" \
        organizations/ccp-template.yaml | sed -e $'s/\\\\n/\\\n          /g'
}

ORG=insurance
NAMEORG=Insurance
P0PORT=7051
P0IP=164.115.33.55
CAPORT=7054
PEERPEM=organizations/peerOrganizations/insurance.covid-ins.com/tlsca/tlsca.insurance.covid-ins.com-cert.pem
CAPEM=organizations/peerOrganizations/insurance.covid-ins.com/ca/ca.insurance.covid-ins.com-cert.pem

echo "$(json_ccp $ORG $NAMEORG $P0PORT $CAPORT $PEERPEM $CAPEM $P0IP)" > organizations/peerOrganizations/insurance.covid-ins.com/connection-insurance.json
echo "$(yaml_ccp $ORG $NAMEORG $P0PORT $CAPORT $PEERPEM $CAPEM $P0IP)" > organizations/peerOrganizations/insurance.covid-ins.com/connection-insurance.yaml

ORG=hospital
NAMEORG=Hospital
P0PORT=9051
P0IP=164.115.33.57
CAPORT=8054
PEERPEM=organizations/peerOrganizations/hospital.covid-ins.com/tlsca/tlsca.hospital.covid-ins.com-cert.pem
CAPEM=organizations/peerOrganizations/hospital.covid-ins.com/ca/ca.hospital.covid-ins.com-cert.pem

echo "$(json_ccp $ORG $NAMEORG $P0PORT $CAPORT $PEERPEM $CAPEM $P0IP)" > organizations/peerOrganizations/hospital.covid-ins.com/connection-hospital.json
echo "$(yaml_ccp $ORG $NAMEORG $P0PORT $CAPORT $PEERPEM $CAPEM $P0IP)" > organizations/peerOrganizations/hospital.covid-ins.com/connection-hospital.yaml

ORG=customer
NAMEORG=Customer
P0PORT=11051
P0IP=164.115.33.56
CAPORT=10054
PEERPEM=organizations/peerOrganizations/customer.covid-ins.com/tlsca/tlsca.customer.covid-ins.com-cert.pem
CAPEM=organizations/peerOrganizations/customer.covid-ins.com/ca/ca.customer.covid-ins.com-cert.pem

echo "$(json_ccp $ORG $NAMEORG $P0PORT $CAPORT $PEERPEM $CAPEM $P0IP)" > organizations/peerOrganizations/customer.covid-ins.com/connection-customer.json
echo "$(yaml_ccp $ORG $NAMEORG $P0PORT $CAPORT $PEERPEM $CAPEM $P0IP)" > organizations/peerOrganizations/customer.covid-ins.com/connection-customer.yaml
