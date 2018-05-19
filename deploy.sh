#!/bin/sh
rsync -e "ssh -i ~/code/test.pem" -avz dist/ ubuntu@13.211.64.110:/home/ubuntu/letter2u
