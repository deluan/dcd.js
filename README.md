dcd
===
[![Build Status](https://travis-ci.org/deluan/dcd.png?branch=master)](https://travis-ci.org/deluan/dcd)
[![NPM version](https://badge.fury.io/js/dcd.png)](http://badge.fury.io/js/dcd)

DCD ported to JavaScript, as a Node.JS console app. The original Free Pascal code can be found at https://github.com/deluan/dcd

This is my first Node (and JS) program, so any feedback is very welcome.

###Yet Another Fast Change Directory based on the honorable NCD

DCD was modeled after [Norton Change Directory (NCD)](http://www.softpanorama.org/OFM/norton_change_directory_clones.shtml). NCD appeared first in The Norton Utilities, Release 4, for DOS in 1987, published by Peter Norton. NCD was written by Brad Kingsbury.

###Installation

* Install it using [NPM](http://nodejs.org/).
```
$ npm install -g dcd
```

* Add this to your ```~/.profile```:
```bash
dcd ()
{
    new_path="$(`which dcd` ${@})";
    case $? in
        0)
            echo -e "\\033[31m${new_path}\\033[0m";
            cd "${new_path}"
        ;;
        2)
            echo "dcd: directory '${@}' not found";
            echo "Try \`dcd -r\` to update db."
        ;;
    esac
}
```

###Usage

* First you need to scan your folder tree (this is a slow process, at least for now):
```bash
    $ dcd -r
```

* Using directories bread crumbs:
```bash
    To go to /usr/local/bin:
    $ dcd ulb

    To go to /bin:
    $ dcd b

    To go to ~/Development/project1:
    $ dcd ~Dp
```

* Using folder name match:
```bash
    To go to /Users/joe/Documents/Etc
    $ dcd Etc

    to go to ~/Development/project1/folder_with_long_name
    $ dcd folder_w
```

* If it's not what you want, repeat the command:
```bash
    To go to /usr/local/bin:
    $ dcd ulb
    /usr/llvm-gcc-4.2/bin
    $ dcd ulb
    /usr/local/bin
```

###Windows

Still not working on Windows. Check back soon.