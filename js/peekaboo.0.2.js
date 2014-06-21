"use strict"

/**
 *
 * Peek-a-boo Plugin
 * Used for adding a simple button peek in/out effect
 *
 * @author Pete Rugh peterugh@gmail.com 
 *
 */

	// Requires some Green Sock Animation Platform files
	// http://www.greensock.com/gsap-js/
	// CSSPlugin.min.js
	// TweenLite.min.js

PeekAboo._bindCtor = function(){};
PeekAboo._addListenerMethod = null;
PeekAboo._removeListenerMethod =  null;

PeekAboo.bind = function(func, context)
{
	// binding scope to event listeners function courtesy of Dane Hansen: www.danehansen.com
	if(Function.prototype.bind && func.bind === Function.prototype.bind)
		return Function.prototype.bind.apply(func, Array.prototype.slice.call(arguments, 1));
	var args=Array.prototype.slice.call(arguments, 2);
	var bound;
	return bound = function()
	{
		if(!(this instanceof bound))
			return func.apply(context, args.concat(Array.prototype.slice.call(arguments)));
		PeekAboo._bindCtor.prototype=func.prototype;
		var self = new PeekAboo._bindCtor;
		PeekAboo._bindCtor.prototype=null;
		var result = func.apply(self, args.concat(Array.prototype.slice.call(arguments)));
		if(Object(result) === result)
			return result;
		return self;
	};
}

function PeekAboo(elements, options)
{
	this.DOM_ELEMENTS = elements;
	if(!options)
		options = {};
	this.EASING_METHOD = options.easingMethod ? options.easingMethod: 'Linear.easeNone';
	this.OVER_MORE_CSS = options.overMoreCSS ? options.overMoreCSS: {};
	this.SLIDE_IN_FROM = options.slideInFrom ? options.slideInFrom: 'bottom';
	this.SLIDE_OUT_TO = options.slideOutTo ? options.slideOutTo: 'bottom';
	this.speedOption = options.speed ? options.speed: 100;
	this.SPEED = this.speedOption / 1000;
	this.UP_MORE_CSS = options.upMoreCSS ? options.upMoreCSS: {};
	this.BUTTONS_READY = options.buttonsReady ? options.buttonsReady: function(buttons,numButtons){};
	this.button;
	this.buttonHeight;
	this.buttonWidth;
	this.overBtnPosX_1;
	this.overBtnPosY_1;
	this.overBtnPosX_2;
	this.overBtnPosY_2;
	this.overState;
	this.positionAssignment = 'relative';
	this.rolledOn = false;
	this.rollOffAnimationDOMone = false;
	this.rollOffAnimationDOMtwo = false;
	this.rollOverAnimationDOMone = false;
	this.rollOverAnimationDOMtwo = false;
	this.upBtnPosX_1;
	this.upBtnPosY_1;
	this.upBtnPosX_2;
	this.upBtnPosY_2;
	this.upState;
	this._rollOnHandler = PeekAboo.bind(this.rollOn,this);
	this._rollOffHandler = PeekAboo.bind(this.rollOff, this);

	if(!PeekAboo._addListenerMethod)
	{
		var testElement = document.createElement('a');
		if(testElement.addEventListener)
		{
			PeekAboo._addListenerMethod = 'addEventListener';
			PeekAboo._removeListenerMethod = 'removeEventListener';
		}
		else if(testElement.attachEvent)
		{
			PeekAboo._addListenerMethod = 'attachEvent';
			PeekAboo._removeListenerMethod = 'detachEvent';
		}
	}
	if(this.DOM_ELEMENTS.length!=undefined && typeof this.DOM_ELEMENTS=="object")
	{
		for(var i=0, numElements = this.DOM_ELEMENTS.length; i < numElements; i++)
		{
			this._prepareElement(this.DOM_ELEMENTS[i], i + 1);
			this.DOM_ELEMENTS[i][PeekAboo._addListenerMethod]("mouseenter", this._rollOnHandler);
			this.DOM_ELEMENTS[i][PeekAboo._addListenerMethod]("mouseleave", this._rollOffHandler);
		}
		this.BUTTONS_READY(this.DOM_ELEMENTS, this.DOM_ELEMENTS.length);
	}
	else
	{
		this._prepareElement(this.DOM_ELEMENTS, 0);
		this.DOM_ELEMENTS[PeekAboo._addListenerMethod]("mouseenter", this._rollOnHandler);
		this.DOM_ELEMENTS[PeekAboo._addListenerMethod]("mouseleave", this._rollOffHandler);
		this.BUTTONS_READY(this.DOM_ELEMENTS, 1);
	}
}
	
	// public methods 

	PeekAboo.prototype.rollOn = function(evt)
	{
		if(!this.rolledOn)
		{
			if(evt.target.className == 'peekaboo_up_state')
			{
				var topPart = evt.target;
				var bottomPart = evt.target.nextElementSibling;
			}
			else
			{
				var topPart = evt.target.children[0];
				var bottomPart = evt.target.children[1];
			}
			this.rolledOn = true;

			//set the proper starting positions for the buttons
			if(this.rollOffAnimationDOMone !== false)
			{
				this.rollOffAnimationDOMone.kill();
				this.rollOffAnimationDOMtwo.kill();	
			}
			if(typeof(topPart) != 'undefined')
			{
				topPart.style.left = '0px';
				topPart.style.top = '0px';

				bottomPart.style.left = this.overBtnPosX_1 + 'px';
				bottomPart.style.top = this.overBtnPosY_1 + 'px';

				// Animate roll over
				this.rollOverAnimationDOMone = new TweenLite.to(topPart, this.SPEED, { left: this.upBtnPosX_1, top: this.upBtnPosY_1, ease:this.EASING_METHOD });
				this.rollOverAnimationDOMtwo = new TweenLite.to(bottomPart, this.SPEED, { left: 0, top: 0, ease:this.EASING_METHOD });
			}
		}	
	}
	PeekAboo.prototype.rollOff = function(evt)
	{
		this.rolledOn = false;


		evt.target.children[0].style.left = this.upBtnPosX_2 + 'px';
		evt.target.children[0].style.top = this.upBtnPosY_2 + 'px';

		evt.target.children[1].style.left = '0px';
		evt.target.children[1].style.top = '0px';

		this.rollOffAnimationDOMone = new TweenLite.to(evt.target.children[0], this.SPEED, { left: 0, top: 0, ease:this.EASING_METHOD });
		this.rollOffAnimationDOMtwo = new TweenLite.to(evt.target.children[1], this.SPEED, { left: this.overBtnPosX_2, top: this.overBtnPosY_2, ease:this.EASING_METHOD });
	}
	
	PeekAboo.prototype.kill = function()
	{
		if(this.DOM_ELEMENTS.length != undefined && typeof this.DOM_ELEMENTS == "object")
		{
			for(var i=0, numElements = this.DOM_ELEMENTS.length; i < numElements; i++)
			{
				this.DOM_ELEMENTS[i][PeekAboo._removeListenerMethod]("mouseenter", this._rollOnHandler);
				this.DOM_ELEMENTS[i][PeekAboo._removeListenerMethod]("mouseleave", this._rollOffHandler);
			}
		}
		else
		{
			this.DOM_ELEMENTS[PeekAboo._removeListenerMethod]("mouseenter", this._rollOnHandler);
			this.DOM_ELEMENTS[PeekAboo._removeListenerMethod]("mouseleave", this._rollOffHandler);
		}
	}

	// private methods

	PeekAboo.prototype._prepareElement = function(button, count)
	{
		this.button = button;
		this.buttonHeight = button.offsetHeight;
		this.buttonWidth = button.offsetWidth;
		var innerElements = [];

		for(var i = 0, numChildren = this.button.childNodes.length; i < numChildren; i++)
		{
			// store the element in an array
			innerElements.push(this.button.childNodes[0]);
			// remove the element (we'll re-add later)
			this.button.removeChild(this.button.childNodes[0]);
		}

		this.upState = document.createElement('span');
		this.overState = document.createElement('span');

		this.upState.className = 'peekaboo_up_state';
		this.overState.className = 'peekaboo_over_state';

		this.button.appendChild(this.upState);
		this.button.appendChild(this.overState);

		for(var i=0, numNodes = innerElements.length; i < numNodes; i++)
		{
			this.button.children[0].appendChild(innerElements[i].cloneNode('deep'));
			this.button.children[1].appendChild(innerElements[i]);
		}

		//If the targeted element is positioned absolutely, then position it that way
		//Otherwise, position is relatively because that is safer
		if(button.style.position == 'absolute')
		{
			this.positionAssignment = 'absolute';
		}
		else
		{
			this.positionAssignment = 'relative';
		}

		// Give the current button a pinch of CSS to assure the plugin positions properly
		this.button.style.position = this.positionAssignment;
		this.button.style.overflow = 'hidden';
		
		// determine how the rollover should be positioned initially
		switch (this.SLIDE_IN_FROM) {
			case 'bottom' :

				this.overBtnPosX_1 = 0;
				this.overBtnPosY_1 = this.buttonHeight;

				this.upBtnPosX_1 = 0;
				this.upBtnPosY_1 = this.buttonHeight * -1;

				break;
			case 'top' :

				this.overBtnPosX_1 = 0;
				this.overBtnPosY_1 = this.buttonHeight * -1;

				this.upBtnPosX_1 = 0;
				this.upBtnPosY_1 = this.buttonHeight;

				break;
			case 'left' :

				this.overBtnPosX_1 = this.buttonWidth * -1;
				this.overBtnPosY_1 = 0;

				this.upBtnPosX_1 = this.buttonWidth;
				this.upBtnPosY_1 = 0;
				
				break;
			case 'right' :

				this.overBtnPosX_1 = this.buttonWidth;
				this.overBtnPosY_1 = 0;

				this.upBtnPosX_1 = this.buttonWidth * -1;
				this.upBtnPosY_1 = 0;
				
				break;
			default :
				break;
		}

		switch (this.SLIDE_OUT_TO) {
			case 'bottom' :
				this.upBtnPosX_2 = 0;
				this.upBtnPosY_2 = this.buttonHeight * -1;

				this.overBtnPosX_2 = 0;
				this.overBtnPosY_2 = this.buttonHeight;

				break;
			case 'top' :
				this.upBtnPosX_2 = 0;
				this.upBtnPosY_2 = this.buttonHeight;

				this.overBtnPosX_2 = 0;
				this.overBtnPosY_2 = this.buttonHeight * -1;
				
				break;
			case 'left' :
				this.upBtnPosX_2 = this.buttonWidth;
				this.upBtnPosY_2 = 0;

				this.overBtnPosX_2 = this.buttonWidth * -1;
				this.overBtnPosY_2 = 0;
				
				break;
			case 'right' :
				this.upBtnPosX_2 = this.buttonWidth * -1;
				this.upBtnPosY_2 = 0;

				this.overBtnPosX_2 = this.buttonWidth;
				this.overBtnPosY_2 = 0;
				
				break;
			default :
				break;
		}

		this.upState.style.position = 'absolute';
		this.upState.style.height = this.buttonHeight + 'px';
		this.upState.style.width = this.buttonWidth + 'px';
		this.upState.style.left = '0px';
		this.upState.style.top = '0px';

		this.overState.style.position = 'absolute';
		this.overState.style.height = this.buttonHeight + 'px';
		this.overState.style.width = this.buttonWidth + 'px';
		this.overState.style.left = this.overBtnPosX_1 + 'px';
		this.overState.style.top = this.overBtnPosY_1 + 'px';		

		for(var property in this.OVER_MORE_CSS)
		{
			this.overState.style[property] = this.OVER_MORE_CSS[property];
		}
	}