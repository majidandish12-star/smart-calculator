/* ======================================================
   Smart Calculator Engine v1
   Focus: Safe Math + Explainability
====================================================== */

class EngineV1 {
  constructor() {
    this.history = [];
  }

  evaluate(input) {
    const clean = this._normalize(input);
    const tokens = this._tokenize(clean);
    const ast = this._parse(tokens);
    const result = this._eval(ast);
    const confidence = this._confidence(ast);

    const output = {
      input,
      normalized: clean,
      result,
      confidence,
      explain: this._explain(ast, result)
    };

    this.history.push(output);
    return output;
  }

  /* ---------- Core ---------- */

  _normalize(str) {
    return str.replace(/×/g,'*').replace(/÷/g,'/').replace(/−/g,'-');
  }

  _tokenize(expr) {
    if (!/^[0-9+\-*/().\s]+$/.test(expr)) {
      throw new Error("INVALID_EXPRESSION");
    }
    return expr.match(/[0-9.]+|[+\-*/()]/g);
  }

  _parse(tokens) {
    const ops = [], out = [];
    const prec = { '+':1,'-':1,'*':2,'/':2 };

    tokens.forEach(t=>{
      if (!isNaN(t)) out.push({type:'num',value:+t});
      else if (t in prec) {
        while (ops.length && prec[ops.at(-1)]>=prec[t]) {
          out.push({type:'op',value:ops.pop()});
        }
        ops.push(t);
      } else if (t==='(') ops.push(t);
      else if (t===')') {
        while (ops.at(-1)!=='(') out.push({type:'op',value:ops.pop()});
        ops.pop();
      }
    });

    ops.reverse().forEach(o=>out.push({type:'op',value:o}));
    return out;
  }

  _eval(ast) {
    const s=[];
    ast.forEach(n=>{
      if(n.type==='num') s.push(n.value);
      else {
        const b=s.pop(),a=s.pop();
        if(n.value==='/' && b===0) throw Error("DIV_ZERO");
        s.push(eval(`${a}${n.value}${b}`));
      }
    });
    return s[0];
  }

  _confidence(ast) {
    let c=0.98;
    if(ast.length>10) c-=0.1;
    return Math.max(0.8,c);
  }

  _explain(ast,res) {
    return `Expression parsed into ${ast.length} steps → result = ${res}`;
  }
}

window.EngineV1 = EngineV1;
