#!/usr/bin/env node
import * as cdk from 'aws-cdk-lib';

const app = new cdk.App();

// Stacks will be added in Phase 6.
// Example:
// new ArchiApiStack(app, 'ArchiApiStack', { /* props */ });

app.synth();
