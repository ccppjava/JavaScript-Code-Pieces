// http://nathansuniversity.com/music.html
// this file supposed to work with node.js 
//
// following compile function is from last lesson
var compile = function (expr) {
    
    var result = [];

    (function endTime(time, expr, ref) {
        // your code here
        (function(expr) {
            if (expr.tag === 'note') {
                expr.start = time || ref;
                result.push(expr);
                
                time += expr.dur;
            } else if (expr.tag === 'par') {
                var endLeft = endTime(0, expr.left, time);
                var endRight = endTime(0, expr.right, time);
                time += endLeft > endRight ? endLeft : endRight;
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
              left: { tag: 'note', pitch: 'a4', dur: 250 },
              right: { tag: 'note', pitch: 'b4', dur: 250 } 
            },
      right:
            { tag: 'seq',
              left: { tag: 'note', pitch: 'c4', dur: 500 },
              right: { tag: 'note', pitch: 'd4', dur: 500 } 
            } 
    };

console.log(melody_mus);
console.log(compile(melody_mus));
