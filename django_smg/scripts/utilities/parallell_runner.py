"""
rn is a command line utility for starting (and stopping) any number of
long-running processes together in subprocesses. Simply provide a list
of comma-delimited bash commands, and they will all be executed. When you
send a SIGTERM to this process, all subprocesses are terminated cleanly
before this program exits. Comma literals in commands can be escaped by a
forward slash.

This script uses only the python3 standard library and has no external
dependencies.

This command is very useful for development environments where a variety
of processes must be started together and run continuously, then stopped
together later on.

Usage: rn [programs (comma-delimited string)]

Run many programs together:
$ rn "ls,pwd,grep -nir \"remember\, escape all commas!\",dig google.com"

Develop django project using webpack...
$ rn "npm run dev,../manage.py runserver"
"""

from copy import copy
from time import sleep
import subprocess
import sys
import signal


class _Process:
    """
    Simple wrapper around subprocess.Popen
    """
    def __init__(self, command: list):
        self.command = command
        self.is_open = False
        self.process = None
        self.pid = None

    def start(self):
        self.process = subprocess.Popen(self.command)
        self.pid = self.process.pid
        self.is_open = True

    def restart(self):
        self.stop()
        self.start()

    def stop(self):
        if not self.process:
            self.is_open = False
            return
        self.process.terminate()
        self.process.wait()
        self.is_open = False

    @ property
    def is_finished(self):
        """
        Process is finished when the poll() method returns None
        """
        return True if self.process.poll() is not None else False


class Runner:
    """
    Take a list of semicolon delimited args and run them all in subprocesses,
    then terminate them all on SIGINT. Hard exit and print dangling process
    warning on SIGTERM
    """
    def __init__(self, arg):
        if arg == '-h' or arg == '--help':
            self._help()
            sys.exit()
        self.arg = arg
        self.procs = []
        self.is_running = False
        signal.signal(signal.SIGINT, lambda *a: self.exit('Gracefully exiting...'))
        signal.signal(signal.SIGTERM, self._hard_exit)

    def start(self):
        self.is_running = True
        for command in self.get_commands():
            proc = _Process(command.split(' '))
            proc.start()
            self.procs.append(proc)
        self._wait_for_exits()

    def restart(self):
        if not self.is_running:
            return self.start()
        self.stop()
        self.start()

    def stop(self):
        for proc in self.procs:
            proc.stop()
            print(f'Terminated {proc.pid}')
            self.is_running = False
        self.procs = []
        pass

    def exit(self, message=None):
        if message:
            print(message)
        if self.is_running:
            self.stop()
        sys.exit()

    def get_commands(self):
        commands = []
        st = ''
        for i, char in enumerate(self.arg):
            is_escaped = False
            if i:
                is_escaped = self.arg[i-1] == '\\'
            if char == ',' and not is_escaped:
                commands.append(copy(st))
                st = ''
            elif char == ',' and is_escaped:
                st = f'{st[:-1]},'
            else:
                st += char
        if st:
            commands.append(st)
        # return commands if commands else st
        if commands:
            return commands
        return st

    def _wait_for_exits(self):
        """
        Wait for all subprocesses to exit, then this program.
        """
        while True:
            all_finished = True
            for proc in self.procs:
                if not proc.is_finished:
                    all_finished = False
            if all_finished:
                self.exit()
            sleep(0.1)

    def _hard_exit(self):
        print(
            'Hard exit has left the following processes dangling:',
            '\n\t'.join([f'{p.pid}\t{p.command}' for p in self.procs])
        )
        sys.exit()

    @ staticmethod
    def _help():
        print(__doc__)

if __name__ == '__main__':
    try:
        Runner(sys.argv[1]).start()
    except IndexError:
        Runner._help()
