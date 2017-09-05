# IoT Design Challenge
## A Post Mortem

The design I wanted to implement was simple: a temperature sensor that spoke to a HVAC unit. The two devices would talk to each other using MQTT provided by AWS IoT.

To simulate a low-power, sleepy device, the temperature sensor wakes up once a minute, reads the "sensor" (In this case, the current temperature in Melbourne), and if there is a change, transmits it. There is also a fake battery sensor that decrements once every five minutes.

I started by setting up AWS. While they provide a UI for this, I wanted it to be reproducible for the assessors so created a CloudFormation stack. I set up a Docker image that would help me create the stack using cfoo and Cirrus.

After creating the Certificate Signing Requests for each device, the CloudFormation document would spin up the three required devices: the temperature sensor, the HVAC and the controller. It also set up a lambda that would be triggered whenever the temperature sensor updated.

Except it didn't.

Due to what I think is a permissions issue, the TopicRule would receive a 400 error from the lambda. Calling the lambda manually worked fine. If I setup the lambda manually it worked fine. Clearly a configuration issue, but I was coming closer to deadline so decided to change tact.

Rather than have a lambda make the decision to switch the HVAC, I built out a fake HVAC that would simply listen to the change of temperature event. I setup another Docker container that listened to the Temperature sensor shadow events.

This didn't work either.

Using the certificate, I could publish events, but no subscribed events were coming through. At this point I was really running out of time, and I had yet to do the controller interface.

I span up a simple Node.JS app using the official AWS node library, but that didn't work either.

Huh?

I believe there is a permissions issue.

Due to looming the deadline, I was forced to abandon the project, and wrote up this post-mortem instead.

## Infrastructure diagram

![](https://raw.githubusercontent.com/madpilot/iot-test/master/infrastructure.png)

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

Note: To find your endpoint, Go to the [IoT console](https://ap-southeast-2.console.aws.amazon.com/iotv2/home?region=ap-southeast-2#/thinghub) and click a thing, then click Interact.

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
docker-compose run temperature-sensor
```

You can now go to the AWS IoT console, and see the shadow document for the temperature sensor update. You can also go to the AWS Lambda console, and trigger a test event with the following payload:

```json
{
  "temperature": 31,
  "battery": 67
}
```
and see the HVAC shadow document updated with a request to turn on the cooling.

## Removing the stack

```
infrastructure/bin/infrastructure deactivate-certificate $STACKNAME TempSensor01
infrastructure/bin/infrastructure deactivate-certificate $STACKNAME HVAC
infrastructure/bin/infrastructure deactivate-certificate $STACKNAME Controller
infrastructure/bin/infrastructure stack delete $STACKNAME
```
## Wrap up

Unfortunately, I didn't finish the challenge because of the AWS permissions rabbit hole. However, I thought this post-mortem was still worth it to explain my thinking, and process.
