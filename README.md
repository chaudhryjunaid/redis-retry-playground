# redis-retry-playground
A program to test redis retry behavior

Start with different client options to test their behavior. E.g.,
```
   NODE_DEBUG=redis node . --connect_timeout=1000
   NODE_DEBUG=redis node . --retry_max_delay=1000
   NODE_DEBUG=redis node . --max_attempts=3
   NODE_DEBUG=redis node .
 ```
 Make sure redis is off on your system if you want to see the retry behavior in action.
