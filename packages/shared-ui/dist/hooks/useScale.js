"use strict";
// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: MIT-0
Object.defineProperty(exports, "__esModule", { value: true });
exports.scaledPixels = void 0;
const react_native_pixel_perfect_1 = require("react-native-pixel-perfect");
const designResolution = {
    width: 1920,
    height: 1080
};
exports.scaledPixels = (0, react_native_pixel_perfect_1.create)(designResolution);
