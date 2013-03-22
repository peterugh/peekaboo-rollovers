/**
 *
 * ButtonRoll Plugin
 * Used for adding a simple button rollup effect
 *
 * @author Pete Rugh peterugh@gmail.com 
 *
 */


;jQuery.fn.buttonRoll = function(options) 
{
	"use strict";

	var settings = $.extend(
	{
		easingMethod: 'linear',
		overMoreCSS: {},
		slideInFrom: 'bottom',
		slideOutTo: 'bottom',
		speed: 100,
		upMoreCSS: {}
	}, options),
	button,
	buttonHeight,
	buttonWidth,
	overBtnPosX_1,
	overBtnPosY_1,
	overBtnPosX_2,
	overBtnPosY_2,
	overDeclarations = {},
	overState,
	positionAssignment = 'relative',
	upBtnPosX_1,
	upBtnPosY_1,
	upBtnPosX_2,
	upBtnPosY_2,
	upDeclarations = {},
	upState;


	function rollOn()
	{
		//set the proper starting positions for the buttons
		$(' .buttonroll_up_state', $(this)).css({
			left: 0,
			top: 0
		});
		$(' .buttonroll_over_state', $(this)).css({
			left: overBtnPosX_1,
			top: overBtnPosY_1
		});

		// Animate roll over
		$(' .buttonroll_up_state', $(this)).stop().animate({
			left: upBtnPosX_1,
			top: upBtnPosY_1
		}, settings.speed, settings.easingMethod);

		$(' .buttonroll_over_state', $(this)).stop().animate({
			left: 0,
			top: 0
		}, settings.speed, settings.easingMethod);
	}
	
	function rollOff(){
		//set proper position for animation out
		$(' .buttonroll_up_state', $(this)).css({
			left: upBtnPosX_2,
			top: upBtnPosY_2
		});

		// Animate roll out
		$(' .buttonroll_up_state', $(this)).stop().animate({
			left: 0,
			top: 0
		}, settings.speed, settings.easingMethod);

		$(' .buttonroll_over_state', $(this)).stop().animate({
			left: overBtnPosX_2,
			top: overBtnPosY_2
		}, settings.speed, settings.easingMethod);
	}

	this.each(function()
	{
		//Assign jquery object to simple variable
		button = $(this);

		//wrap the plain text inside with span tag
		button.wrapInner('<span class="buttonroll_up_state"/>');
		
		//Duplicate and then change class of current content
		$(' .buttonroll_up_state', $(this))
			.clone()
			.removeClass('buttonroll_up_state')
			.addClass('buttonroll_over_state')
			.appendTo(button);
		
		// assign jQuery objects to simple variable
		upState = $(' .buttonroll_up_state', $(this));
		overState = $(' .buttonroll_over_state', $(this));
		buttonHeight = button.outerHeight();
		buttonWidth = button.outerWidth();
		
		//If the targeted element is positioned absolutely, then position it that way
		//Otherwise, position is relatively because that is safer
		if(button.css('position') == 'absolute')
		{
			positionAssignment = 'absolute';
		}
		else
		{
			positionAssignment = 'relative';
		}

		// Give the current button a pinch of CSS to assure the plugin positions properly
		button.css({
			position: positionAssignment,
			overflow: 'hidden'
		});	
		
		// determine how the rollover should be positioned initially
		switch (settings.slideInFrom) {
			case 'bottom' :

				overBtnPosX_1 = 0;
				overBtnPosY_1 = buttonHeight;

				upBtnPosX_1 = 0;
				upBtnPosY_1 = buttonHeight * -1;

				break;
			case 'top' :

				overBtnPosX_1 = 0;
				overBtnPosY_1 = buttonHeight * -1;

				upBtnPosX_1 = 0;
				upBtnPosY_1 = buttonHeight;

				break;
			case 'left' :

				overBtnPosX_1 = buttonWidth * -1;
				overBtnPosY_1 = 0;

				upBtnPosX_1 = buttonWidth;
				upBtnPosY_1 = 0;
				
				break;
			case 'right' :

				overBtnPosX_1 = buttonWidth;
				overBtnPosY_1 = 0;

				upBtnPosX_1 = buttonWidth * -1;
				upBtnPosY_1 = 0;
				
				break;
			default :
				break;
		}

		switch (settings.slideOutTo) {
			case 'bottom' :
				upBtnPosX_2 = 0;
				upBtnPosY_2 = buttonHeight * -1;

				overBtnPosX_2 = 0;
				overBtnPosY_2 = buttonHeight;

				break;
			case 'top' :
				upBtnPosX_2 = 0;
				upBtnPosY_2 = buttonHeight;

				overBtnPosX_2 = 0;
				overBtnPosY_2 = buttonHeight * -1;
				
				break;
			case 'left' :
				upBtnPosX_2 = buttonWidth;
				upBtnPosY_2 = 0;

				overBtnPosX_2 = buttonWidth * -1;
				overBtnPosY_2 = 0;
				
				break;
			case 'right' :
				upBtnPosX_2 = buttonWidth * -1;
				upBtnPosY_2 = 0;

				overBtnPosX_2 = buttonWidth;
				overBtnPosY_2 = 0;
				
				break;
			default :
				break;
		}


		//Begin building CSS object for mandatory styling
		upDeclarations = {
			position: 'absolute',
			height: buttonHeight,
			width: buttonWidth,
			left: 0,
			top: 0
		};
		overDeclarations = {
			position: 'absolute',
			height: buttonHeight,
			width: buttonWidth,
			left: overBtnPosX_1,
			top: overBtnPosY_1
		};

		//mandatory css styling
		upState.css(upDeclarations);
		overState.css(overDeclarations);

		//Add the user's custom CSS declarations
		upState.css(settings.upMoreCSS);
		overState.css(settings.overMoreCSS);

		//Listen for the hover event
		button.hover(rollOn, rollOff);
		
	});
};