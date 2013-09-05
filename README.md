DCD.JS
======

DCD ported to JavaScript, as a Node.JS console app. The original can be found at https://github.com/deluan/dcd

###Yet Another Fast Change Directory based on the honorable NCD

DCD was modeled after Norton Change Directory (NCD). NCD appeared first in The Norton Utilities, Release 4, for DOS in 1987, published by Peter Norton. NCD was written by Brad Kingsbury.

###INSTALLATION

* Install it using NPM:

```
$ npm install -g dcd
```

* Add this to your ~/.profile:

```
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
