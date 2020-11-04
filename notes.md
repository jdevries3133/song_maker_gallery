# ToDo:

- [ ] Experiment with Splash, see if it can render the songmaker page
**if not:**
    - [ ] Dockerize legacy screenshot bot
- [ ] Make background images load lazily
- [ ] Fix lingering "Delete Successful" dialogue
- [ ] Integrate cloudfront
- [ ] Make apache deliver sitemap and robots, not django
- [ ] Prepare screenshot bot for deployment to ECS spot instances
- [ ] check for duplicate links just so users don't blow up AWS costs.
- [ ] backend & frontend for managing payments / subscriptions
  - [ ] containerize
  - [ ] gracefully respond to SIGTERM
  - [ ] optimize (see notes below)

## Cost / Pricing

- Freemium model
- Free tier
  - Galleries available overnight (fargate spot)
- Buy 5 immediate galleries for \$5
  - best priced api: https://www.thum.io/#pricing
  - let them watch screenshots being captured in frontend
    (future feature?)

# Deployment Stacks:

### Pricing Based On U.S. East Ohio

**Stack_1_Price**

_web service:_

- (0.25*0.04048*24*30*2) #=> 0.25vCPU \* 2 continuous, load balanced

- (0.004445*1*24*30*2) #=> 1gb RAM \* 2 continuous

_screenshotter service:_

- (0.01254299 \* 60) #=> 1vCPU 60h / mo. for screenshots (ECS spot)
- (0.00137731 \* 120) #=> 2gb RAM / mo. for screenshots (ECS spot)

_cloudfront to serve images_

- 0 #=> free tier up to 2m get requests

_AWS aroura on-demand database_

- 4 #=> on-demand cost may be less than that

### Stack_1_Price = \$25.89 / mo.

# Balancing Costs Against Revenue

> As per the pricing model above, the app will use a freemium model. Users must be somewhat motivated to use the paid tier for the app to reach the goal of being cost neutral. There will be a free trial tier, a subscription option, or a pay-as-you-go option.

### Free Tier Limits

- 3 Galleries at a time
- 500 screenshot cap
- 48 Hour turnaround guarantee (but aim for average turnaround of 24h)

### Subscription Benefits (\$8/mo)

- Unlimited galleries
- Immediate turnaround on galleries

### Pay as you Go

- 10 slow galleries for \$5 (unlimited screenshots)
  - ECS Fargate spot instances
- 5 immediate galleries for \$5 (unlimited screenshot)
  - API or spin up fargate on-demand instance maybe?

## Cost per Screenshot

> \$0.04937 for Fargate On-Demand
> \$0.02785546 for Fargate Spot

> \$0.10 cost per free user for 300 screenshots
> \$0.617125 cost per paid user (1000 fargate on-demand screenshots)

- Screenshotter will use 1 vCPUs
- Screenshotter will use 2 Gb. of RAM (javascript renderer); 4gb for headless chrome

### Fargate On-Demand

- 0.04048 / vCPU / hr.
- 0.004445 / Gb. of RAM / hr.
- **base** price / hour: \$0.04937

**Assuming Javascript Renderer; Assuming a screenshot takes 0.75sec.**

- \$0.000617125 per screenshot

### Fargate Spot Instance

- 0.01254968 / vCPU / hr.
- 0.00137805 / Gb of RAM / hr.
- **base** price / hour: \$0.02785546

- **Assuming Javascript Renderer; Assuming a screenshot takes 0.75sec.**

  - \$0.00034819325 per screenshot

# Optimizing Screenshots

- Consider removing google chrome dependency
- [Splash javascript renderer is a possible alternative](https://splash.readthedocs.io/en/stable/)
- Maybe node.js / express is a better technology for this service

## The Best & Hardest Option

The endpoint for midi files from the chrome music lab is easily accessible. If it were possible to render the images dynamically from the midi file, that would be extra nifty, but idk if that is doable. Consider the many metric options in the music lab – I don't know how that is represented in MIDI, but I think it be a complex endavor.
