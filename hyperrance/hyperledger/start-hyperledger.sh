#!/bin/bash
#
# Copyright IBM Corp All Rights Reserved
#
# SPDX-License-Identifier: Apache-2.0
#
# Exit on first error
set -e

./network.sh down
./network.sh up createChannel -ca -s couchdb
./network.sh deployCC -l javascript