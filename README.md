# IoT Design Challenge
## A Post Mortem

The design I wanted to implement was fairly simple: a temperature sensor that spoke to a HVAC unit. The two devices would talk to eachnother using MQTT provided by AWS IoT.

I decided to start by setting up AWS. While they provide a UI for this, I wanted it to be reproducible for the assessor's so I decided to use cloudformation. I set up a docker image that would help me create the Cloudformation stack using cfoo and cirrus.

After creating the CSRs for each device, the cloud formation document would spin up the three required devices: the temperature sensor, the HVAC and the controller. It also set up a lambs that would be triggered when ever the temperature sensor updated.

Except it didn't.

Due to what I think is a permissions issue, the TopicRule would receive a 400 error from the lambda. Calling the lambda manually worked fine. If I setup the lambda manually it worked fine. Clearly a configuration issue, but I was coming closer to deadline so decided to change tact.

Rather than have a lambda make the decision to switch the HVAC, I looked into building out a fake HVAC that would simply listen to the change of temperature event. I setup another docker container that listened to the Temperature sensor shadow events.

This didn't work either.

Using the certificate, I could publish events, but no subscribed events were coming through. At this point I was really running out of time, and I had yet to do the controller interface.

I spun up a simple Node.JS app using the official AWS non library, and it was unable to subscribe to topics.

Huh?

I believe there is a permissions issue.

## Infrastructure diagram

## Bringing up the stack

If you want to see all the bits not working together:

(Note: this will spin up a cloudformation stack and set resources up. This MAY incur some costs. You will obviously need an AWS  account)

```bash
export AWS_ACCESS_KEY=[Your AWS Access Key]
export AWS_SECRET_KEY=[Your AWS Secrey Key]
export AWS_REGION=[Your AWS region. ap-southeast-2 is a good one]
export STACK_NAME=[A stack name. iot would work]
export IOT_ENDPOINT=[Your AWS IoT endpoint. See the notes]
```

```bash
git clone git@github.com:madpilot/Iot-test
cd iot-test
```

```bash
docker-compose build
docker-compose run -w /lambdas/setHVACMode lambdas yarn build
infrastructure/bin/infrastructure generate-csr $STACKNAME TempSensor01
infrastructure/bin/infrastructure generate-csr $STACKNAME HVAC
infrastructure/bin/infrastructure generate-csr $STACKNAME Controller
infrastructure/bin/infrastructure stack create $STACKNAME
infrastructure/bin/infrastructure update-lambda iot SetHVACMode
docker-compose run
```

You can now hit [http://localhost:8080](http://localhost:8080) to see a non-updating UI.

# Removing the stack

You have to do it manually.

```
infrastructure/bin/infrastructure deactivate-certificate $STACKNAME TempSensor01
infrastructure/bin/infrastructure deactivate-certificate $STACKNAME HVAC
infrastructure/bin/infrastructure deactivate-certificate $STACKNAME Controller
infrastructure/bin/infrastructure stack delete $STACKNAME
```
