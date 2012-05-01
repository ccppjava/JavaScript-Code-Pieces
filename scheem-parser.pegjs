start =
    expression

expression = 
    atom
  / listatom
  / nestedlist
    
validchar
    = [0-9a-zA-Z_?!+\-=@#$%^&*/.]

atom =
    chars:validchar+
        { return chars.join(""); }
     
listatom = 
    "(" space* natom:atom satom:spaceatom* space* ")"
        { if (satom && satom.length) {
              satom.unshift(natom);
              return satom;
          } else {
              return [natom];
          }
        }

nestedlist = 
    "(" space* natom1:atom* satom1:spaceatom* space* latom1:listatom* space* ")"
        {
            var result = [];
            if (natom1 && natom1.length) {
                result = result.concat(natom1);
            }
            
            if (satom1 && satom1.length) {
                result = result.concat(satom1);
            }
            
            if (latom1 && latom1.length) {
                result = result.concat(latom1);
            }
            
            return result;
        }

space =
    " "
    
spaceatom = 
    space natom:atom
        { return natom; }
