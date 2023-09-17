# Bitfinex Assessment
This is the code for the Bitfinex assessment. 

# Running 
The apps/bfx-exchange should be run simulate the exchange. The app basically acts as a monolith that integrates the different services.
This service uses ports 3000 - 3005 plus the standard grape ports. See [app.js](./apps/bfx-exchange/src/app.js)


* Clone the repo
* From the root `npm install`
* From the root `npm start` 

Running the above command will start grape and the bfx-exchange service. 


# Requirements / Assumptions
As the requirements were a little vague as-well as the distinction between the terms decentralized and distributed. I was not sure if this is to be modeled as decentralized exchange made up of peers.  
However, giving the limited time, I opted for a centralized or leader trade engine to simplify updates instead of some kind of consensus model between the 
decentralized nodes. Clients still contain their own local of the order book, but a leader or centralized server contains the master copy.

# Solution
The bfx-trade-change service, contains the master copy of the order book, and performs the matching of the trades. When a trade is updated it distributes the order
update to the order-service peers that contain the local copies.  There was no need or display so the order books are pretty simple, a specific ordering could be applied in the 
future for display.  The trade engine provides a very simple matching it uses priority that utilize min / max binary heaps to do the matching.

Clients were created to simplify calling each service / server they exist in the package directory.


# Code Layout 
[turbo repo](https://github.com/vercel/turbo/) is used to organize the code, in a mono repo approach.

* apps
  * bfx-exchange:  a simple server that includes the other services as kind of monolith and is mainly used to simulates the exchange.
  * bfx-id-generator-service: a simple id generator service, used for generating ids.
  * bfx-order-service: Simple node / service that contains a local order book and places orders.
  * bfx-trade-engine: contains the master copy of the order book, that distributes changes to order-service and performs the trade matching in the background.
* packages:  contains libs
  * orderbook: contains code related to the order book, note the order book is not sorted as there is currently no requirement to maintain it sorted if sorted is required in the future a different approach can be used.
  * trade-engine:  the trading engine that matches the orders and updates the order book, in the future the trading engine could execute the trade.

# Improvements
Obviously this is a simple project and I spent a little time reading... about grenache. In this case some possible improvements could include:

* Introduce the ability for the clients to sync their local instance of the order book in the background, could be done based on a snapshot.
* Add Command line interface to test with.
* Better validation, and error messages...
* Some configuration properties are hard coded move to configuration files and, possibly files for different environments.
* Better test coverage and documentation: Unit, Integration And E2E Tests.
* The id generation is pretty basic this would probably need to be replaced in production, depending on the persistence mechanism for example:
  - ulid
  - time ordered id such provided by persistence mechanism such as ObjectId in mongo (distributed) sequence postgres
  - custom id generator for example twitter snowflake.
* Better background jobs....
* Add support or initializing order books from existing orders on restart
* Order / Trade management to support order management. Probably an independent service that will be queried to create the order book, for admin UI, crud, etc.
* Support different order types such as market, limit, stop etc.
* Possibly more services for:
    * managing users, 
    * trade execution / engine, 
    * Services for different on and off ramps (Deposits and Withdrawals) for both crypto and fiat.
    * KYC and users limits.
* Possibly Distributed locking, options such use redis, optimistic locking etc.
* User Model, and management of users.
* Store User Balances, for different currencies, and ensure the user has the balance before placing the order etc.
* Possibly Currency conversion, before executing a trade.
* Resiliency, Circuit breaker etc.
* Better documentation consider type doc for typescript.
* Emit Events so different services could process these events successfully, trading events, orders.
* Maybe user KYC is required
* Metrics, Monitoring, Logging, for production.
