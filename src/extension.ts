'use strict';

import * as vscode from 'vscode';
import { ktlint } from 'ktlint';

const childProcess = require('child_process');
const { exec } = childProcess;

function runCommand(command) {
  exec(command, (err, stdout, stderr) => {
    // the *entire* stdout and stderr (buffered)
    console.log(stdout);
    console.log(stderr);

    if (err) {
      console.log('Could not execute the command');
      console.log(err);
      // node couldn't execute the command
      return;
    }
  });
}

export function activate(context: vscode.ExtensionContext) {
  const supportedDocuments: vscode.DocumentSelector = [{ language: 'kotlin' }];

  // 👍 formatter implemented using API
  const formatter = vscode.languages.registerDocumentFormattingEditProvider(
    supportedDocuments,
    {
      provideDocumentFormattingEdits(
        document: vscode.TextDocument
      ): vscode.TextEdit[] {
        ktlint(`-F ${document.uri.path}`);
        const firstLine = document.lineAt(0);
        return [vscode.TextEdit.insert(firstLine.range.start, '')];
      }
    }
  );

  context.subscriptions.push(formatter);
}
