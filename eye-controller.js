function deg2rad(degrees)
{
  var pi = Math.PI;
  return degrees * (pi/180);
}
class EyeController {
  constructor(elements = {}, eyeSize = "33.33vmin") {
    this._eyeSize = eyeSize;
    this._irisRatio = 0.3;
    this._blinkTimeoutID = null;
    this._talkTimeoutID = null;

    this.setElements(elements);

    this.startBlinking(2000);
  }

  get leftEye() {
    return this._leftEye;
  }
  get rightEye() {
    return this._rightEye;
  }

  setElements ({
    face,
    leftEye,
    rightEye,
    leftIris,
    rightIris,
    upperLeftEyelid,
    upperRightEyelid,
    lowerLeftEyelid,
    lowerRightEyelid,
    mouth
  } = {}) {
    this._face = face;
    this._leftEye = leftEye;
    this._rightEye = rightEye;
    this._leftIris = leftIris;
    this._rightIris = rightIris;
    this._upperLeftEyelid = upperLeftEyelid;
    this._upperRightEyelid = upperRightEyelid;
    this._lowerLeftEyelid = lowerLeftEyelid;
    this._lowerRightEyelid = lowerRightEyelid;
    this._mouth = mouth;
    return this;
  }

  _createKeyframes({
    tgtTranYVal = 0,
    tgtRotVal = 0,
    enteredOffset = 1 / 3,
    exitingOffset = 2 / 3,
  } = {}) {
    return [
      { transform: `translateY(0px) rotate(0deg)`, offset: 0.0 },
      {
        transform: `translateY(${tgtTranYVal}) rotate(${tgtRotVal})`,
        offset: enteredOffset,
      },
      {
        transform: `translateY(${tgtTranYVal}) rotate(${tgtRotVal})`,
        offset: exitingOffset,
      },
      { transform: `translateY(0px) rotate(0deg)`, offset: 1.0 },
    ];
  }

  express({
    type = "",
    // level = 3,  // 1: min, 5: max
    duration = 1000,
    enterDuration = 75,
    exitDuration = 75,
  }) {
    if (!this._leftEye) {
      // assumes all elements are always set together
      console.warn("Eye elements are not set; return;");
      return;
    }

    const options = {
      duration: duration,
    };

    switch (type) {
      case "happy":
        return {
          lowerLeftEyelid: this._lowerLeftEyelid.animate(
            this._createKeyframes({
              tgtTranYVal: `calc(${this._eyeSize} * -2 / 3)`,
              tgtRotVal: `30deg`,
              enteredOffset: enterDuration / duration,
              exitingOffset: 1 - exitDuration / duration,
            }),
            options
          ),
          lowerRightEyelid: this._lowerRightEyelid.animate(
            this._createKeyframes({
              tgtTranYVal: `calc(${this._eyeSize} * -2 / 3)`,
              tgtRotVal: `-30deg`,
              enteredOffset: enterDuration / duration,
              exitingOffset: 1 - exitDuration / duration,
            }),
            options
          ),
        };

      case "sad":
        return {
          upperLeftEyelid: this._upperLeftEyelid.animate(
            this._createKeyframes({
              tgtTranYVal: `calc(${this._eyeSize} * 1 / 3)`,
              tgtRotVal: `-20deg`,
              enteredOffset: enterDuration / duration,
              exitingOffset: 1 - exitDuration / duration,
            }),
            options
          ),
          upperRightEyelid: this._upperRightEyelid.animate(
            this._createKeyframes({
              tgtTranYVal: `calc(${this._eyeSize} * 1 / 3)`,
              tgtRotVal: `20deg`,
              enteredOffset: enterDuration / duration,
              exitingOffset: 1 - exitDuration / duration,
            }),
            options
          ),
        };

      case "angry":
        return {
          upperLeftEyelid: this._upperLeftEyelid.animate(
            this._createKeyframes({
              tgtTranYVal: `calc(${this._eyeSize} * 1 / 4)`,
              tgtRotVal: `30deg`,
              enteredOffset: enterDuration / duration,
              exitingOffset: 1 - exitDuration / duration,
            }),
            options
          ),
          upperRightEyelid: this._upperRightEyelid.animate(
            this._createKeyframes({
              tgtTranYVal: `calc(${this._eyeSize} * 1 / 4)`,
              tgtRotVal: `-30deg`,
              enteredOffset: enterDuration / duration,
              exitingOffset: 1 - exitDuration / duration,
            }),
            options
          ),
        };

      case "focused":
        return {
          upperLeftEyelid: this._upperLeftEyelid.animate(
            this._createKeyframes({
              tgtTranYVal: `calc(${this._eyeSize} * 1 / 3)`,
              enteredOffset: enterDuration / duration,
              exitingOffset: 1 - exitDuration / duration,
            }),
            options
          ),
          upperRightEyelid: this._upperRightEyelid.animate(
            this._createKeyframes({
              tgtTranYVal: `calc(${this._eyeSize} * 1 / 3)`,
              enteredOffset: enterDuration / duration,
              exitingOffset: 1 - exitDuration / duration,
            }),
            options
          ),
          lowerLeftEyelid: this._lowerLeftEyelid.animate(
            this._createKeyframes({
              tgtTranYVal: `calc(${this._eyeSize} * -1 / 3)`,
              enteredOffset: enterDuration / duration,
              exitingOffset: 1 - exitDuration / duration,
            }),
            options
          ),
          lowerRightEyelid: this._lowerRightEyelid.animate(
            this._createKeyframes({
              tgtTranYVal: `calc(${this._eyeSize} * -1 / 3)`,
              enteredOffset: enterDuration / duration,
              exitingOffset: 1 - exitDuration / duration,
            }),
            options
          ),
        };

      case "confused":
        return {
          upperRightEyelid: this._upperRightEyelid.animate(
            this._createKeyframes({
              tgtTranYVal: `calc(${this._eyeSize} * 1 / 3)`,
              tgtRotVal: `-10deg`,
              enteredOffset: enterDuration / duration,
              exitingOffset: 1 - exitDuration / duration,
            }),
            options
          ),
        };

      default:
        console.warn(`Invalid input type=${type}`);
    }
  }

  blink({
    duration = 150, // in ms
  } = {}) {
    if (!this._leftEye) {
      // assumes all elements are always set together
      console.warn("Eye elements are not set; return;");
      return;
    }

    [this._leftEye, this._rightEye].map((eye) => {
      eye.animate(
        [
          { transform: "rotateX(0deg)" },
          { transform: "rotateX(90deg)" },
          { transform: "rotateX(0deg)" },
        ],
        {
          duration,
          iterations: 1,
        }
      );
    });
    // [this._leftIris, this._rightIris].map((iris) => {
    //   iris.animate()
    // })
  }

  startBlinking({ maxInterval = 5000 } = {}) {
    if (this._blinkTimeoutID) {
      console.warn(
        `Already blinking with timeoutID=${this._blinkTimeoutID}; return;`
      );
      return;
    }
    const blinkRandomly = (timeout) => {
      this._blinkTimeoutID = setTimeout(() => {
        this.blink();
        blinkRandomly(Math.random() * maxInterval);
      }, timeout);
    };
    blinkRandomly(Math.random() * maxInterval);
  }

  stopBlinking() {
    clearTimeout(this._blinkTimeoutID);
    this._blinkTimeoutID = null;
  }

  talk({
    duration = 150, // in ms
  } = {}) {
    if (!this._mouth) {
      // assumes all elements are always set together
      console.warn("Mouth elements are not set; return;");
      return;
    }

    [this._mouth].map((el) => {
      el.animate(
        [
          { transform: "rotateX(0deg)" },
          { transform: "rotateX(90deg)" },
          { transform: "rotateX(0deg)" },
        ],
        {
          duration,
          iterations: 1,
        }
      );
    });
    // [this._leftIris, this._rightIris].map((iris) => {
    //   iris.animate()
    // })
  }

  startTalking({ maxInterval = 500 } = {}) {
    if (this._talkTimeoutID) {
      console.warn(
        `Already talking with timeoutID=${this._talkTimeoutID}; return;`
      );
      return;
    }
    const talkRandomly = (timeout) => {
      this._talkTimeoutID = setTimeout(() => {
        this.talk();
        talkRandomly(Math.random() * maxInterval);
      }, timeout);
    };
    talkRandomly(Math.random() * maxInterval);
  }

  stopTalking() {
    clearTimeout(this._talkTimeoutID);
    this._talkTimeoutID = null;
  }

  stopGaze ({ duration = 500, // in ms
  } = {}) {
    [this._leftIris, this._rightIris].map((el) => {
      el.animate(
        [
          { transform: "translate(0, 0)" },
          // { transform: "translateX(0)" },
        ],
        {
          duration,
          fill: 'forwards',
          // easing: 'steps(10, end)',
          iterations: 1,
        }
      );
       
    });
    this._face.animate([{ transform: "rotateX(0deg) rotateY(0deg)" }], {
      duration, fill: 'forwards', iterations: 1
    });
  }
  gaze ({ duration = 800, // in ms
    direction = 0 } = {}) {
    // var dir = deg2rad(direction)
    // console.log(Math.cos( dir), Math.sin(dir));
   
     [this._leftIris, this._rightIris].map((el) => {
      el.animate(
        [
          { transform: "translate(0, 0)" },
          { transform: "translate(-90%, 30%)" },
          // { transform: "translateX(0)" },
        ],
        {
          duration,
          fill: 'forwards',
          // easing: 'steps(10, end)',
          iterations: 1,
        }
      );
       
     });
    this._face.animate(
      [
        { transform: "rotateY(45deg) rotateX(10deg)" },
        // { transform: "rotateX(-30deg)" }
      ], {
      duration, fill: 'forwards', iterations: 1
    });
    // this.express({ type: "focused", duration: duration });
  }

  // setEyePosition(eyeElem, x, y, isRight = false) {
  //   if (!eyeElem) {
  //     // assumes all elements are always set together
  //     console.warn("Invalid inputs ", eyeElem, x, y, "; retuning");
  //     return;
  //   }

  //   if (!!x) {
  //     if (!isRight) {
  //       eyeElem.style.left = `calc(${this._eyeSize} / 3 * 2 * ${x})`;
  //     } else {
  //       eyeElem.style.right = `calc(${this._eyeSize} / 3 * 2 * ${1 - x})`;
  //     }
  //   }
  //   if (!!y) {
  //     eyeElem.style.bottom = `calc(${this._eyeSize} / 3 * 2 * ${1 - y})`;
  //   }
  // }
}

export const eyes = new EyeController({
  face: document.querySelector(".face"),
  leftEye: document.querySelector(".left.eye"),
  rightEye: document.querySelector(".right.eye"),
  leftIris: document.querySelector(".left .iris"),
  rightIris: document.querySelector(".right .iris"),
  upperLeftEyelid: document.querySelector(".left .eyelid.upper"),
  upperRightEyelid: document.querySelector(".right .eyelid.upper"),
  lowerLeftEyelid: document.querySelector(".left .eyelid.lower"),
  lowerRightEyelid: document.querySelector(".right .eyelid.lower"),
  mouth: document.querySelector(".mouth"),
});

// export default eyes;
