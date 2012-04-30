start =
    wordlist

    wordlist =
        nword:word sword:spaceword*
                { var result = (sword && sword.length) ?
                                sword.unshift(nword) : [nword];
                                          return result;
                                                  }

word = 
    nword:[a-z]+
            { return nword.join(""); }

            space = 
                " "
                    
                spaceword = 
                    space nword:word
                            { return nword; }
                                    
