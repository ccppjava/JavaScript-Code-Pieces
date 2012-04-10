// http://nathansuniversity.appspot.com/

// the Challenge Problem of pre-requisit

var count = function(tree, seq) {
    if (tree === null) {
        return 0;
    }
    
    if (!seq) {
        sum = 0;
    }
    
    arguments.callee(tree.left, true);
    arguments.callee(tree.right, true);
    ++sum;
    
    return sum;
};

// ++++++++++++++++++++++++++++++++++++++++++++++

var count = function(tree) {
    var sum = 0;
    
    (function walkTree(tree) {    
        if (tree === null) {
            return;
        }
        
        walkTree(tree.left);
        walkTree(tree.right);
        
        ++sum;
    })(tree);
    
    return sum;
};

// ++++++++++++++++++++++++++++++++++++++++++++++

var count = function(tree) {
    if (tree === null) {
        return 0;
    }
    
    var count = 0;
    var queue = [tree];
    
    while(queue.length) {
        var node = queue.shift();
        ++count;
        if (node.left) {
            queue.push(node.left);
        }
        
        if (node.right) {
            queue.push(node.right);
        }
    }
    
    return count;
};

