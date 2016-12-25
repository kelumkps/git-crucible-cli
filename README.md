# git-crucible-cli

```
  ____   _  _           ____                     _  _      _
 / ___| (_)| |_        / ___| _ __  _   _   ___ (_)| |__  | |  ___
 | |  _ | || __|_____ | |    | '__|| | | | / __|| || '_ \ | | / _ \
 | |_| || || |_|_____|| |___ | |   | |_| || (__ | || |_) || ||  __/
 \_____||_| \__|       \____||_|    \__,_| \___||_||_.__/ |_| \___|


An interactive command-line tool for git-crucible-review-creator
Version: 1.0.0
```

### An Interactive command-line tool for [git-crucible-review-creator](https://github.com/kelumkps/git-crucible-review-creator).

`git-crucible-cli` is a complementary project for [git-crucible-review-creator](https://github.com/kelumkps/git-crucible-review-creator) which comes with an Interactive command-line tool. `git-crucible-cli` is a hassle free way to download the latest stable release of [git-crucible-review-creator](https://github.com/kelumkps/git-crucible-review-creator) from Github, apply configurations and install it on any git project.

Currently it's supporting below operations:

1. Install and configure [git-crucible-review-creator](https://github.com/kelumkps/git-crucible-review-creator) script in to a desired git project
2. Completely uninstall an already installed pre-push script from a given git project.
3. Temporary disable an installed pre-push script.
4. Enable back an already disabled pre-push script.
5. Add reviewers to a given git-crucible-review-creator script.
6. Remove reviewers from a given git-crucible-review-creator script.

## Install

`$ npm install -g git-crucible`

## Usage

```
$ git-crucible --help

  Usage: git-crucible [options] [command]


  Commands:

    install     install and configure git-crucible-review-creator script in to a desired git project
    uninstall   uninstall git-crucible-review-creator script from a given git project
    disable     disable git-crucible-review-creator script from a given git project
    enable      enable git-crucible-review-creator script from a given git project
    reviewer    allows to add or remove reviewers. use "add" and "remove" sub commands
    help [cmd]  display help for [cmd]

  Options:

    -h, --help     output usage information
    -V, --version  output the version number
    -a, --all      specify all installed scripts

```

## Available Commands and Sub Commands

### Install
`git-crucible install`

When you invoke install command, it will ask few questions to get below configurations for installing a new [git-crucible-review-creator](https://github.com/kelumkps/git-crucible-review-creator) script.

configuration | Description | Example Input
--------------|-------------|---------
project_location| Path to the git project to install the script| /home/my-user/worspace/my-project
crucible_url | URL of the Crucible Server |https://my-crucible-server:8080
username | A valid username which as access to create code reviews on the above Crucible server. | myuser
password | Login password of above user | 123456
project_key | The Crucible Project Key where Code review entry should be created | CR-FOO
reviewers | One or more space seperated usersnames to include as reviewers in created code review. | scott joe krish


### Uninstall
`git-crucible uninstall`

When you invoke this command inside a project location (any directory level of the project path) where [git-crucible-review-creator](https://github.com/kelumkps/git-crucible-review-creator) script is already installed, it will completely remove the script from the project.

You can also invoke this command on any other directory, the tool will prompt the list of projects where [git-crucible-review-creator](https://github.com/kelumkps/git-crucible-review-creator) script is installed for you to select one to uninstall.

### disable
`git-crucible disable`

When you invoke this command inside a project location (any directory level of the project path) where [git-crucible-review-creator](https://github.com/kelumkps/git-crucible-review-creator) script is already installed and enabled, it will temporary disable the script from functioning.

You can also invoke this command on any other directory, the tool will prompt the list of projects where [git-crucible-review-creator](https://github.com/kelumkps/git-crucible-review-creator) script is installed for you to select one to disable.

### enable
`git-crucible enable`

When you invoke this command inside a project location (any directory level of the project path) where [git-crucible-review-creator](https://github.com/kelumkps/git-crucible-review-creator) script is already disabled, it will enable back the script.

You can also invoke this command on any other directory, the tool will prompt the list of projects where [git-crucible-review-creator](https://github.com/kelumkps/git-crucible-review-creator) script is installed for you to select one to enable.

### reviewer add
`git-crucible reviewer add [space seperated usersnames]`

When you invoke this command inside a project location (any directory level of the project path) where [git-crucible-review-creator](https://github.com/kelumkps/git-crucible-review-creator) script is already installed, it will add the given usernames to the reviewers list.

You can also invoke this command on any other directory, the tool will prompt the list of projects where [git-crucible-review-creator](https://github.com/kelumkps/git-crucible-review-creator) script is installed for you to select one to add reviewers.

When you invoke this command without passing usernames (i.e. `git-crucible reviewer add`), it will
prompt later to enter usernames for addition.

### reviewer remove
`git-crucible reviewer remove [space seperated usersnames]`

When you invoke this command inside a project location (any directory level of the project path) where [git-crucible-review-creator](https://github.com/kelumkps/git-crucible-review-creator) script is already installed, it will remove the given usernames from the reviewers list.

You can also invoke this command on any other directory, the tool will prompt the list of projects where [git-crucible-review-creator](https://github.com/kelumkps/git-crucible-review-creator) script is installed for you to select one to remove reviewers.

When you invoke this command without passing usernames (i.e. `git-crucible reviewer remove`), it will
prompt later to enter usernames for removal.

### help
`git-crucible help [cmd]`

Displays the help for the available commands and sub commands.

License
=======
MIT License

Copyright (c) 2016 [Kelum Senanayake](https://github.com/kelumkps/)

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
