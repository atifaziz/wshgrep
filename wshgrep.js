// Windows (WSH) script to search regular expressions
// Copyright (c) 2016 Atif Aziz
//
// Permission is hereby granted, free of charge, to any person obtaining a
// copy of this software and associated documentation files
// (the "Software"), to deal in the Software without restriction, including
// without limitation the rights to use, copy, modify, merge, publish,
// distribute, sublicense, and/or sell copies of the Software, and to permit
// persons to whom the Software is furnished to do so, subject to the
// following conditions:
//
// The above copyright notice and this permission notice shall be included
// in all copies or substantial portions of the Software.
//
// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS
// OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
// MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT.
// IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY
// CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT,
// TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE
// SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.

Array.prototype.filter = function (callback, thisArg) {
    var result = [];
    for (var i = 0; i < this.length; i++) {
        var item = this[i];
        if (callback.call(thisArg, item, i, this))
            result.push(item);
    }
    return result;
};

Array.prototype.partition = function (callback, thisArg) {
    var yes = []; var no = [];
    for (var i = 0; i < this.length; i++) {
        var item = this[i];
        (callback.call(thisArg, item, i, this) ? yes : no).push(item);
    }
    return [yes, no];
};

Array.fromEnumerable = function (source) {
    var arr = [];
    for (var e = new Enumerator(source) ; !e.atEnd(); e.moveNext()) {
        arr.push(e.item());
    }
    return arr;
};

Array.prototype.indexOf = function (item) {
    for (var i = 0; i < this.length; i++) {
        if (i in this && this[i] === item) {
            return i;
        }
    }
    return -1;
};

Array.prototype.contains = function (item) { return this.indexOf(item) >= 0; };

var args = Array.fromEnumerable(WScript.Arguments)
                .partition(function (arg) { return /^-v$/.test(arg); }),
    stdin = WScript.StdIn,
    stdout = WScript.StdOut,
    stderr = WScript.StdErr;

var flags = args.shift(),
    tail = args.shift(),
    pattern = tail[0];

var filter =
    pattern
    ? (function (re) { return function (s) { return re.test(s); } })(new RegExp(pattern))
    : function () { return true };

if (flags.contains('-v')) {
    filter = (function (filter) { return function (s) { return !filter(s); }; })(filter);
}

var found = false;

var readln = function (ts) { return ts.AtEndOfStream ? null : ts.ReadLine(); }
for (var line = readln(stdin) ; line != null; line = readln(stdin)) {
    if (filter(line)) {
        found = true;
        stdout.WriteLine(line);
    }
}

WScript.Quit(found ? 0 : 1);
