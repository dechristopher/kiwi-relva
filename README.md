# relva

## TODO

- [x] Bot Connection
- [x] Command Runner
- [x] Help Command
- [x] About Command
- [ ] User Class
- [x] DB Connection (MySQL)
- [x] Cache Connection (Redis)
- [ ] DB Frontend API (register, stats, getInfo, etc)
- [ ] Linking Steam IDs to Discord Users (just have them give profile URL)
- [x] User Profile Pictures from Discord Avatar
- [ ] Queuing Architecture
- [ ] Party Architecture
- [ ] Queuing (Party and Solo) + Algorithm
- [ ] Queue Command
- [ ] Party Command
- [ ] Admin Commands

## Project Structure

- doc/ (contains documentation and related project info)
- logs/ (generated for log output on first run)
- modules/ (contains all project sub-modules)
    - deprecated/ (contains old/deprecated/unused modules)
    - ops/ (contains implemented database, cache, and backend operations as small modules)
    - service/ (contains factories for connections to different services and data sources)
    - util / (contains non-critical utility modules)
- node_modules/ (contains NPM module code)
- tools/ (contains scripts to improve the dev workflow)
- .gitignore (list of file regexes for git to ignore)
- .jshintrc (JS configuration options for the KIWI style-guide)
- CHANGELOG (the relva changelog)
- CONTRIBUTING.md (a guide for making, discussing, and merging changes to relva)
- index.js (the core relva module)
- package.json (information about relva's dependencies and repo)
- README.md (the file you're currently reading)