# WSH Grep

A grep-like utility for Windows implemented using WSH (Windows Script Host) for
times when you do not want any Node, PowerShell or similar baggage.

Usage:

    wshgrep [-v] PATTERN

`PATTERN` is a [JScript regular expression][jsre] pattern.

The optional `-v` inverts the sense of matching, to select non-matching lines.


## Examples

List files in `%SystemRoot%` that end in `.exe`:

    dir %SystemRoot% /b | wshgrep \.exe$

Invert the above to list files that do not end in `.exe`:

    dir %SystemRoot% /b | wshgrep -v \.exe$


[jsre]: https://msdn.microsoft.com/en-us/library/28hw3sce(v=vs.100).aspx