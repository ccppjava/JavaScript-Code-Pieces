// http://nathansuniversity.com/music.html
// this file supposed to work with node.js 
//

var convertPitch = function(pitch) {
    var dict = {c: 0, d: 2, e: 4, f: 5, g: 7, a: 9, b: 11};
    if (pitch.length === 2 && dict[pitch[0]] !== undefined) {
        return 12 * (1 + parseInt(pitch[1])) + dict[pitch[0]]; 
    }
};

// my compile/edit in place cause issue when repeat is added
// e.g. output: { tag: 'note', pitch: undefined, dur: 220, start: 940 },
// thus need following shallow copy function, using jQuery style
var copyObject = function() {
    var args = Array.prototype.slice.apply(arguments);
    //console.log(args);
    var target = args.shift(0) || {};
    for (var i = 0; i < args.length; ++i) {
        for (var key in args[i]) {
            if (args[i].hasOwnProperty(key)) {
                target[key] = args[i][key];
            }
        }
    }

    return target;
};

// following compile function is from last lesson
var compile = function (expr) {
    
    var result = [];

    (function endTime(time, expr, ref) {
        // your code here
        (function(expr) {
            if (expr.tag === 'note' || expr.tag === 'rest') {
                /*
                expr.start = time || ref;
                if (expr.pitch) {
                    expr.pitch = convertPitch(expr.pitch);
                }
                result.push(expr);
                */
                var note = copyObject({}, expr, {start: time || ref});
                if (expr.pitch) {
                    note = copyObject(note, {pitch: convertPitch(expr.pitch)});
                }

                result.push(note);
                
                time += expr.dur;
            } else if (expr.tag === 'par') {
                var endLeft = endTime(0, expr.left, time);
                var endRight = endTime(0, expr.right, time);
                time += endLeft > endRight ? endLeft : endRight;
            } else if (expr.tag === 'repeat') {
                for (var i = 0; i < expr.count; ++i) {
                    arguments.callee(expr.section);
                }
            } else {
                arguments.callee(expr.left);
                arguments.callee(expr.right);
            }
        })(expr);
        
        return time;
    })(0, expr, 0);
        
    return result;
};

// testing code
var melody_mus = 
    { tag: 'seq',
      left: 
            { tag: 'seq',
              left: { tag: 'par',
                      left: { tag: 'rest', dur: 200 },
                      right: { tag: 'note', pitch: 'b4', dur: 250 } 
                    },
              right: { tag: 'rest', dur: 250 } 
            },
      right:
            { tag: 'seq',
              left: { tag: 'repeat', 
                      section: { tag: 'note', pitch: 'c4', dur: 220 }, 
                      count: 3 
                    },
              right: { tag: 'note', pitch: 'd4', dur: 500 } 
            } 
    };

console.log(melody_mus);
console.log(compile(melody_mus));

// testing the copyObject function
//console.log(copyObject());
//console.log(copyObject({}));
//console.log(copyObject({}, {a: 1}));
//console.log(copyObject({}, {a: 1, b: 2}, {b: 3}));
