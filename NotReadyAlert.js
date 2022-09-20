var finesse = finesse || {};
finesse.gadget = finesse.gadget || {};
finesse.container = finesse.container || {};
_clientLogger = finesse.cslogger.ClientLogger || {};  // for logging

/** @namespace */
finesse.modules = finesse.modules || {};
finesse.modules.NotReadyAlert = (function ($) {
	var _user = null, _state = null, _containerServices = null;
   
    /**
     * Updates the Gadget UI based on the current state of the objects contained within.
     */
    _updateUI = function () {
    	_clientLogger.log ("_updateUI() - _state: " + ((_state === null) ? "none" : _state));
		
		// Here you could extract the extension of the Participant that is watching and show it to them if desired.
		if (_state === null) {
			$('#yourBeingWatchedMsg').hide();		
			$('#coastClearMsg').fadeIn("slow",0, function() {gadgets.window.adjustHeight();});
		} else {
			if (_state === 'NOT_READY') {
				$('#coastClearMsg').hide();		
				$('#yourBeingWatchedMsg').fadeIn("slow",0, function() {gadgets.window.adjustHeight();});
				
				$('head title', window.parent.document).text('Not Ready - Cisco Finesse');
				
				_containerServices.showDialog({
					title: 'Not Ready Alert',
					message: 'Your State is Not Ready!',
					isBlocking: true
				});
			}
			else {
				$('#yourBeingWatchedMsg').hide();		
				$('#coastClearMsg').fadeIn("slow",0, function() {gadgets.window.adjustHeight();});
				$('head title', window.parent.document).text('Ready - Cisco Finesse');
			}
		}
        gadgets.window.adjustHeight();
    },
	
    /**
     * Handler for the onLoad of a User object.  This occurs when the User object is initially read
     * from the Finesse server.  Any once only initialization should be done within this function.
     */
    _handleUserLoad = function (user) {
		_clientLogger.log ("_handleUserLoad()");
		_clientLogger.log(user.getState());

		_state = user.getState();
         
        _updateUI();
    },
      
    /**
     *  Handler for all User updates
     */
    _handleUserChange = function(user) {
		_clientLogger.log("_handleUserChange()");
		_clientLogger.log(user.getState());
		
		_state = user.getState();

        _updateUI();
   };
	    
	/** @scope finesse.modules.NotReadyAlert */
	return {
	    /**
	     * Performs all initialization for this gadget
	     */
	    init : function () {
			_clientLogger = finesse.cslogger.ClientLogger;   // declare _clientLogger

            // Initiate the ClientLogs. The gadget id will be logged as a part of the message
			_clientLogger.init(gadgets.Hub, "NotReadyAlert", finesse.gadget.Config);
			_clientLogger.log ("init(): Initializing...");
		        
			// Initiate the ClientServices and load the user object.  ClientServices are
			// initialized with a reference to the current configuration.
			finesse.clientservices.ClientServices.init(finesse.gadget.Config);
			_containerServices = finesse.containerservices.ContainerServices.init();

			_user = new finesse.restservices.User({
				id: finesse.gadget.Config.id, 
				onLoad : _handleUserLoad,
				onChange : _handleUserChange
			});
				
			_clientLogger.log ("init(): Initialization finished.");
	    }
    };
}(jQuery));
