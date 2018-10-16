# Data Management Tool 🌚

Data Management Tool

# Development

#### On your laptop:

```
make dev
```

# Deploy

#### 1. On your laptop:

```
make deploy
```

You will need to enter the ssh passphrase at some point.


#### 2. On the remote machine:

```
cd ~/DMT
make run-server
```

# TODO

* Setup PostgreSQL on the remote machine.
* Remote host is using *Python 3.5*, not *3.6* 😂
* Run server in the background (should not shutdown after disconnected from ssh).
* Restart the server directly at the end of `make deploy`.
