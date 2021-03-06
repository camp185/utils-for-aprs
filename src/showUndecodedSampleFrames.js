/*
Licensed to the Apache Software Foundation (ASF) under one
or more contributor license agreements.  See the NOTICE file
distributed with this work for additional information
regarding copyright ownership.  The ASF licenses this file
to you under the Apache License, Version 2.0 (the
"License"); you may not use this file except in compliance
with the License.  You may obtain a copy of the License at

  http://www.apache.org/licenses/LICENSE-2.0

Unless required by applicable law or agreed to in writing,
software distributed under the License is distributed on an
"AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
KIND, either express or implied.  See the License for the
specific language governing permissions and limitations
under the License.
*/

var KISSFrameParser=require("./kiss-frame-parser.js");
var sampleFrames=require("./spec/sample-frames.js").sampleFrames;
var ax25utils=require("./ax25-utils.js");

var parser=new KISSFrameParser();
var APRSParser=require("./aprs-info-parser.js");
var aprsParser=new APRSParser();

var parsedAprs=0;
var undecodedErrors={};

sampleFrames.forEach(function(item, index) {
  if (item.length===0) { return; }
  parser.setInput(Buffer.from(item));
  var frame=parser.parseFrame();
  try {
    aprsParser.parse(frame);
    //console.log("Frame is " + JSON.stringify(frame, null, 2));
    parsedAprs++;
  } catch(err) {
    if (undecodedErrors[err]===undefined) {
      undecodedErrors[err]=0;
    }
    undecodedErrors[err]=undecodedErrors[err]+1;
    console.log("[%d] %s -> %s via %s : %s",
      index,
      ax25utils.addressToString(frame.source),
      ax25utils.addressToString(frame.destination),
      ax25utils.repeaterPathToString(frame.repeaterPath),
      frame.info.toString("utf8"));
    console.log("...couldn't decode APRS: %s", err);
  }

});

console.log("APRS Parser worked on %d frames of %d", parsedAprs, sampleFrames.length);
console.log(undecodedErrors);
