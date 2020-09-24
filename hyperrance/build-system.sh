#!/bin/bash
#
# Copyright IBM Corp All Rights Reserved
#
# SPDX-License-Identifier: Apache-2.0
#
# Exit on first error

set -e

rm -rf service-api/wallet/*

pushd ./hyperledger
./start-hyperledger.sh
popd

# forever start ./service-api/api.js

# forever start -c "npm start" ./web/