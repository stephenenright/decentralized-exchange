# bfx-order-service
For the purpose of the demo this service used to execute an order.
The service acts as a peer that uses the trade engine client to interact with the trade engine. 
It maintains a local copy of the order book, and synchronizes it with the master copy from the trade engine.

In the real world it could perform functionality as:

* Check a taxonomy
* Check a users balance

