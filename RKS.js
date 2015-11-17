/**
 * Created by Admin on 11.10.2015.
 */
var Result=function(x0,y0,t0){

    this.x=[];
    this.y=[];
    this.t=[];

    this.x[0]=x0;
    this.y[0]=y0;
    this.t[0]=t0;

    this.length=function(){
        return this.t.length;
    }

    return this;
}

var System=function(f,g,x0,y0,a,b){

	this.result;
	this.x0=x0;
    this.y0=y0;
    this.a=a;
    this.b=b;

    var F=function(x,y,t){
        return eval(f);
    }
    var G=function(x,y,t){
        return eval(g);
    }
    var compare=function(prev,next,precision){
    	var residualConstant=2;

        for (var i=0;i<prev.length;i++){
            if ( (Math.abs(prev.x[i]-next.x[i*residualConstant]) > precision ) ||
                 (Math.abs(prev.y[i]-next.y[i*residualConstant]) > precision ) ){
                return false;
            }
        }
        return true;

    }
    /*this.print=function(){
        console.log(this.x0+' + '+this.y0+' + '+f);
    }*/
 	this.JRK1=function(step){
        var result = new Result(this.x0,this.y0,this.a);
        var N  = (this.b-this.a)/step;
        for (var i=1;i<=N;i++){
            result.t[i]=result.t[i-1]+step;
            result.x[i]=result.x[i-1]+step*F(result.x[i-1],result.y[i-1],result.t[i-1]);
            result.y[i]=result.y[i-1]+step*G(result.x[i-1],result.y[i-1],result.t[i-1]);
        }
    	return result;
	}        
	this.JRK1_eps=function(eps,b){
		startStep=2;
		var prev,next;
		do{
			prev=this.JRK1(startStep);
			startStep*=2;
			next=this.JRK1(startStep);
		} while(compare(prev,next,eps));

		return next;
	}

    this.NA_WithStep=function(step){
    	
    	this.result = this.JRK1(step);
    	var N = (this.b-this.a)/step;
 
   			this.result.x[i]=this.result.x[i-1]+(step/12)*(5*F(this.result.x[i-1],this.result.y[i-1],this.result.t[i-1])+
   														   8*F(this.result.x[i-2],this.result.y[i-2],this.result.t[i-2])-
  														     F(this.result.x[i-3],this.result.y[i-2],this.result.t[i-3]));	
   			this.result.x[i]=this.result.x[i-1]+(step/12)*(5*G(this.result.x[i-1],this.result.y[i-1],this.result.t[i-1])+
   														   8*G(this.result.x[i-2],this.result.y[i-2],this.result.t[i-2])-
  														     G(this.result.x[i-3],this.result.y[i-2],this.result.t[i-3]));		
   		}
   		return this.result;
    }

module.exports=System;


