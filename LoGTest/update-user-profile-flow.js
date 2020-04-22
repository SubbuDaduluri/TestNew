/**

 * This javascript is responsible for updating the user profile information using routing technique
 * Author Mobily Infotech
 */
/***************angular  model *****************************/
/**
 * ngRoute:resposible for routing
 * ngMessages : to Display the angular messages
 * xeditable: to create the dynamic table
 */
var controllerModuleAPP = angular.module('UpdateUserProfileWebflowApp', ['ui.router', 'ui.select', 'ngSanitize', 'ngMessages', 'xeditable', 'angularUtils.directives.dirPagination', 'ncy-angular-breadcrumb', 'ngImgCrop']);
/**
 * factory() is the service method in the angular js which is responsible for storing the data in one global variable
 */
controllerModuleAPP.directive('fileModel', ['$parse', function($parse) {
    return {
        restrict: 'A',
        link: function(scope, element, attrs) {
            var model = $parse(attrs.fileModel);
            var modelSetter = model.assign;

            element.bind('change', function() {
                scope.$apply(function() {
                    modelSetter(scope, element[0].files[0]);
                });
            });
        }
    };
}]);

controllerModuleAPP.directive('uiSelectRequired', function() {
    return {
        restrict: 'EA',
        require: 'ngModel',
        link: function(scope, element, attr, ctrl) {
            ctrl.$validators.uiSelectRequired = function(modelValue, viewValue) {
                if (attr.uiSelectRequired) {
                    var isRequired = scope.$eval(attr.uiSelectRequired)
                    if (isRequired == false)
                        return true;
                }
                var determineVal = !_.isEmpty(modelValue);
                if (angular.isArray(modelValue)) {
                    determineVal = modelValue;
                } else if (angular.isArray(viewValue)) {
                    determineVal = viewValue;
                } else if (angular.isObject(modelValue)) {
                    determineVal = angular.equals(modelValue, {}) ? [] : ['true'];
                } else if (angular.isObject(viewValue)) {
                    determineVal = angular.equals(viewValue, {}) ? [] : ['true'];
                } else {
                    return false;
                }
                return determineVal.length >= 0;
            };
        }
    };
});

/*controllerModuleAPP.directive('uiSelectRequired', function() {
	  return {
	    require: 'ngModel',
	    link: function(scope, elm, attrs, ctrl) {
	      ctrl.$validators.uiSelectRequired = function(modelValue, viewValue) {
 	        var determineVal;
	        if (angular.isArray(modelValue)) {
	          determineVal = modelValue;
	        } else if (angular.isArray(viewValue)) {
	          determineVal = viewValue;
	        } else {
	          return false;
	        }
 	        return determineVal.length > 0;
	      };
	    }
	  };
	});*/


controllerModuleAPP.factory('userPersonalDetails', ['$http', '$rootScope', '$q', function($http, $rootScope, $q) {


    var userProfileDataData = {};
    userProfileDataData.data = false;
    userProfileDataData.setData = function(data) {
        this.data = data;
    };
    userProfileDataData.getData = function() {
        return this.data;
    };
    return userProfileDataData;
}]);
controllerModuleAPP.service('fileUpload', ['$http', '$rootScope', '$q', function($http, $rootScope, $q) {

    this.stringToDate = function(_date, _format, _delimiter) {
        var formatLowerCase = _format.toLowerCase();
        var formatItems = formatLowerCase.split(_delimiter);
        var dateItems = _date.split(_delimiter);
        var monthIndex = formatItems.indexOf("mm");
        var dayIndex = formatItems.indexOf("dd");
        var yearIndex = formatItems.indexOf("yyyy");
        var month = parseInt(dateItems[monthIndex]);
        month -= 1;
        var formatedDate = new Date(dateItems[yearIndex], month, dateItems[dayIndex]);
        return formatedDate;
    }

    this.uploadNewFileToUrl = function(file) {



            var fd1 = new FormData();
            fd1.append('file', file);
            return $http.post('upload-file', fd1, {
                transformRequest: angular.identity,
                headers: {
                    'Content-Type': undefined
                }
            })
        }
        /*this.uploadFileToUrl = function(file,formNames,fileId){
            var fd = new FormData();
            fd.append('file', file);
            //fd.append('properties', fileDetails);
            
         
           return $http.post('upload-downloadcenter-file', fd, {
               transformRequest: angular.identity,
               headers: {'Content-Type': undefined}
            })
        }*/
    this.deleteFile = function(deleteFileName) {
        var fd = new FormData();
        fd.append('deleteFileName', deleteFileName);

        $http.post('delete-qualification-details', fd, {
            transformRequest: angular.identity,
            headers: {
                'Content-Type': undefined
            }
        })

        .success(function(data, status, headers, config) {


        })

        .error(function(data, status, headers, config) {
            notif({
                type: "error",
                msg: "Sorry upload failed.",
                position: "center",
                multiline: true,
                timeout: 6000
            });
        });
    }
}]);
/****************Flow sonfiguration in angualr js using ngRoute ********************/
/**
 * $routeProvider:
 * $locationProvider
 */

/*controllerModuleAPP.config(function($stateProvider, $urlRouterProvider){
    
    // For any unmatched url, send to /route1
    $urlRouterProvider.otherwise("/landingpage")
    
    $stateProvider
    
         .state('updateuserprofile', {
            url: "/update-user-profile",
            templateUrl : 'update-user-profile.do',//*****this will call java controller*************
       	 controller  : 'update-user-profile-controller',           //*****this will call angular js controller*************
       
       	  ncyBreadcrumb: {
            label: 'Update Profile',
           parent: 'helloPage'
             }
         })
        
    .state('updateuserprofile.personalInfo', {
          url: "/personal-info",
          templateUrl : 'personal-info-webflow.do',
     	 controller  : 'personal-info-controller',
     	ncyBreadcrumb: {
            label: 'Personal Info',
            parent: 'updateuserprofile'
          }
      })
       .state('updateuserprofile.institutionalInformation', {
            url: "/institutional-information",
            templateUrl : 'institutional-information-webflow.do',
   		 controller  : 'institutional-information-controller',
   		ncyBreadcrumb: {
            label: 'Institutional Information',
            parent: 'updateuserprofile'
          }
        })
        .state('updateuserprofile.areaofInterest', {
            url: "/areaofinterest",
            templateUrl : 'areaofinterest-info-webflow.do',
       	    controller:'areaofinterest-page-controller',
       	 ncyBreadcrumb: {
             label: 'Area Of Interest',
             parent: 'updateuserprofile'
           }
        })
         .state('updateuserprofile.certifications', {
            url: "/certifications",
            templateUrl : 'certification-webflow.do',
       	     controller:'certification-page-controller',
       	  ncyBreadcrumb: {
              label: 'Certifications',
              parent: 'updateuserprofile'
            }
        })
         .state('updateuserprofile.employment', {
            url: "/employment",
            templateUrl : 'employment-webflow.do',
       	    controller:'employment-page-controller',
       	 ncyBreadcrumb: {
             label: 'Employment',
             parent: 'updateuserprofile'
           }
        })
        .state('updateuserprofile.experience', {
            url: "/experience",
            templateUrl : 'experience-webflow.do',
   		    controller:'experience-page-controller',
   		 ncyBreadcrumb: {
             label: 'Experience',
             parent: 'updateuserprofile'
           }
        })
        .state('updateuserprofile.publication', {
            url: "/publication",
            templateUrl : 'publication-webflow.do',
   		 controller:'publication-page-controller',
   		ncyBreadcrumb: {
            label: 'Publication',
            parent: 'updateuserprofile'
          }
        })
        .state('updateuserprofile.password-management', {
            url: "/password-management",
            templateUrl : 'update-pin-password-webflow.do',
                  controller:'password-management-controller',
                  ncyBreadcrumb: {
                      label: 'Password Management',
                      parent: 'updateuserprofile'
                    }
        })

  })
  */


/* controllerModuleAPP.run(function($rootScope, $state, $breadcrumb) {
   $rootScope.isActive = function(stateName) {
     return $state.includes(stateName);
   }

   $rootScope.getLastStepLabel = function() {
     return 'Angular-Breadcrumb';
   }
 });*/

/***************angular js controller for main page ***************************/
controllerModuleAPP.controller('update-user-profile-controller', ['$scope', 'userPersonalDetails', '$http', '$rootScope', function($scope, userPersonalDetails, $http, $rootScope) {
    sessionStorage.removeItem('updateProfileactiveTab');
    sessionStorage.setItem("moduleNameOnlineHelp","PROFILE");

}]);
/*************** personal-info page controller***************/
controllerModuleAPP.service('profilePicUpload', ['$http', function($http) {
    this.uploadProfilePic = function(file, uploadUrl, $scope) {
        var fd = new FormData();
        fd.append('file', file);

        var res = $http.post(uploadUrl, fd, {
            transformRequest: angular.identity,
            headers: {
                'Content-Type': undefined
            }


        })
        res.success(function(data, status, headers, config) {
            if (data) {
                var myCallback = function() {
                    document.getElementById('1stImage').src = 'imageDisplay';
                    document.getElementById('2ndImage').src = 'imageDisplay';
                    return false;
                }

                notif({
                    type: "success",
                    msg: "Profile pic uploaded successfully",
                    multiline: true,
                    position: "center",
                    timeout: 6000,
                    append: false,
                    'callback': myCallback

                });
                $scope.myFile = '';
                //var myVar = setInterval(test, 3000);
                //test();
            } else {
                notif({
                    type: "warning",
                    msg: mesaages.file_upload_fail,
                    multiline: true,
                    position: "center",
                    timeout: 6000,
                    append: false
                });
            }
        });
        res.error(function(data, status, headers, config) {
            notif({
                type: "warning",
                msg: mesaages.Somth_error_serv_plz_cont_serv_adm,
                multiline: true,
                position: "center",
                timeout: 6000,
                append: false
            });
        });
    }

    function test() {
        setTimeout(function() {
            location.reload();
            //location.href="helloPage#/update-user-profile/personal-info"
        }, 1000);
    }
}]);
controllerModuleAPP.controller('personal-info-controller', ['$scope', 'userPersonalDetails', '$http', '$compile', '$rootScope', 'componentService', 'profilePicUpload','NewCodeSetServiceJS', function($scope, userPersonalDetails, $http, $compile, $rootScope, componentService, profilePicUpload,NewCodeSetServiceJS) {//profile pic crop starts
	$scope.myImage = '';
	$scope.myCroppedImage = '';
	$scope.hrEmplDtlDisabled = false;
	$scope.hideForOtherOrgn = false;
	$scope.MyNewCodeSetServiceJS = NewCodeSetServiceJS;
	$scope.requiredCorporationNo = false;
	var handleFileSelect = function(evt) {
	    var file = evt.currentTarget.files[0];
	    var reader = new FileReader();
	    reader.onload = function(evt) {
	        $scope.$apply(function($scope) {
	            $scope.myImage = evt.target.result;
	        });
	    };
	    reader.readAsDataURL(file);
	};
	angular.element(document.querySelector('#file_name')).on('change', handleFileSelect);
	$rootScope.resMyTaskDescription=undefined;
	sessionStorage.setItem("moduleNameOnlineHelp","PROFILE");
	/**
	 * for access control module code
	 */
	var requestedUrl = "url";
	var  URL = window.location.href;
	requestedUrl  =  URL.substring(URL.lastIndexOf('/')  +  1);
	URL = "/" + requestedUrl;
	componentService.getSessionDataInPage($scope, URL);
	$scope.$MyService = componentService;
	// finish access control module impl

	$scope.success = false;
	$scope.failure = false;
	$scope.error = false;
	$scope.invalid = false;
	$scope.isDisabled = false;
	$scope.GetComponentValidation = function() {
	    if ($scope.component_name.is_required == "yes") {
	        $scope.primary_communication = $scope.component_name.is_required;
	        $("#isPhone").prop("checked", true)
	    } else if ($scope.component_name.is_required == "no") {
	        $scope.primary_communication = $scope.component_name.is_required;
	        $("#isEmail").prop("checked", true)
	    }

	}
	$scope.primary_communication = ['email', 'phone'];
	$scope.selection = ['email'];
	$scope.toggleSelection = function toggleSelection(fruitName) {
	    var idx = $scope.selection.indexOf(fruitName);
	    if (idx > -1) {
	        $scope.selection.splice(idx, 1);
	    }
	    else {
	        $scope.selection.push(fruitName);
	    }
	};
	//Get the list of title starts here 
	 $scope.getAllCodeSetsByTitle=function(codesetData){
	    	NewCodeSetServiceJS.getAllCodeSetsByType(codesetData)
	         .then(function (data) {
	        	 $scope.titleList = [];
	     	    $scope.titleList = data.codeSetsEntity;
	         },
	         function (errorMessage) {
	            //alert("getAllCodeSetsByCodeSetType Error Message:"+errorMessage);
	         });
	    }
	//ends here
	//Get the list of country 
	$scope.getAllCodeSetsByCountry=function(codesetData){
    	NewCodeSetServiceJS.getAllCodeSetsByType(codesetData)
         .then(function (data) {
        	 $scope.countries = data.codeSetsEntity;
         },
         function (errorMessage) {
            //alert("getAllCodeSetsByCodeSetType Error Message:"+errorMessage);
         });
    }
	// get nationality from code set
	$scope.getAllCodeSetsByNationality=function(codesetData){
    	NewCodeSetServiceJS.getAllCodeSetsByType(codesetData)
         .then(function (data) {
        	 $scope.nationalitys = data.codeSetsEntity;
         },
         function (errorMessage) {
            //alert("getAllCodeSetsByCodeSetType Error Message:"+errorMessage);
         });
    }
	//Get the gender
	$scope.getAllCodeSetsByGender=function(codesetData){
    	NewCodeSetServiceJS.getAllCodeSetsByType(codesetData)
         .then(function (data) {
        	 $scope.userGender = data.codeSetsEntity;
         },
         function (errorMessage) {
            //alert("getAllCodeSetsByCodeSetType Error Message:"+errorMessage);
         });
    }
	//parent choild codeset code starts here for country state
	$scope.getState = function(codesetType) {
	    var dataObjForCourse = {
	        codeSet: codesetType
	    };
	    var res = $http.post('getCodeSetByParentCodeSetextra',dataObjForCourse);
	    res.success(function(data, status, headers, config) {
	        $scope.states = [];
	        $scope.states = data;
	    });
	    res.error(function(data, status, headers,
	        config) {});
	}
	//ends here 
	
	//parent choild codeset code starts here for city
	$scope.getCity = function(state) {
	    var dataObjForCourse = {
	        codeSet: state
	    };
	    var res = $http.post('getCodeSetByParentCodeSetextra', dataObjForCourse);
	    res.success(function(data, status, headers,config) {
	        $scope.cities = [];
	        $scope.cities = data;
	    });
	    res.error(function(data, status, headers,
	        config) {});
	}
	

	$scope.setDisplayName = function() {
	    if ($scope.f_name == undefined || $scope.l_name == undefined) {

	    } else {
	        if ($scope.m_name == undefined) {
	            $scope.m_name = '';
	        }
	        $scope.display_name = $scope.f_name + " " + $scope.m_name + " " + $scope.l_name;
	    }

	}

	//ends here
	$scope.personalInfo = function() {
	    $http({
	            method: 'GET',
	            url: 'get-personal-info-page-data'
	        })
	        .success(function(data, status, headers, config) {
	            $scope.userpersonalInfoDetails = data.personalInfoDetails;
	            sessionStorage.setItem("organization", $scope.userpersonalInfoDetails.organization);
	            sessionStorage.setItem("organization_SD", $scope.userpersonalInfoDetails.organization_shortDesc);
	            $scope.organizationName=$scope.userpersonalInfoDetails.organization_shortDesc;
	            $scope.prefix = $scope.userpersonalInfoDetails.prefix_codeset;
	            $scope.prefixtitle=$scope.userpersonalInfoDetails.prefix;
                $scope.f_name = $scope.userpersonalInfoDetails.first_name;
                $scope.m_name = $scope.userpersonalInfoDetails.middle_name;
                $scope.l_name = $scope.userpersonalInfoDetails.last_name;
                $scope.display_name = $scope.userpersonalInfoDetails.preferred_name;
                $scope.primary_email_id = $scope.userpersonalInfoDetails.primary_email_id;
                $scope.corporation_no = $scope.userpersonalInfoDetails.corporation_no;
                $scope.highest_degree = $scope.userpersonalInfoDetails.highest_degree;
                $scope.country = $scope.userpersonalInfoDetails.country;
                $scope.countrytitle = $scope.userpersonalInfoDetails.country_shortDesc;
                $scope.statetitle = $scope.userpersonalInfoDetails.state_shortDesc;
                $scope.citytitle = $scope.userpersonalInfoDetails.city_shortDesc;
                $scope.getState($scope.country);
                $scope.state = $scope.userpersonalInfoDetails.state;
               // $scope.getCity($scope.state);
                $scope.city = $scope.userpersonalInfoDetails.city;
                $scope.postal_code = $scope.userpersonalInfoDetails.postal_code;
                $scope.primary_contact_no = $scope.userpersonalInfoDetails.primary_contact_no;
	            $scope.secondary_contact_no = $scope.userpersonalInfoDetails.secondary_contact_no;
	            $scope.fax = $scope.userpersonalInfoDetails.fax;
	            $scope.gender = $scope.userpersonalInfoDetails.gender;
	            $scope.nationality = $scope.userpersonalInfoDetails.nationality;
	            $scope.secondary_email_id = $scope.userpersonalInfoDetails.secondary_email_id;
	            $scope.emailcommn = $scope.userpersonalInfoDetails.primary_communication;
	            $scope.phone_commn = $scope.userpersonalInfoDetails.primary_phone_communication;
	            $scope.email_notification = $scope.userpersonalInfoDetails.recieve_email_notification;
	            $scope.isSmsnotification = $scope.userpersonalInfoDetails.recieve_sms_notification;
	            $scope.bleep_no = $scope.userpersonalInfoDetails.bleep_no;
	            $scope.isHrEnabled= $scope.userpersonalInfoDetails.isHrEnabled;
	            $scope.isEmpIdReq= $scope.userpersonalInfoDetails.isEmpIdReq;
	            if($scope.userpersonalInfoDetails.organization == "OTHERS"){
	            	  $scope.hideForOtherOrgn = false;
                      $scope.requiredCorporationNo = false;
	            }else{
	            	 $scope.hideForOtherOrgn = true;
	            }
	            if($scope.isHrEnabled=="Y"){
	            	$scope.hrEmplDtlDisabled=true;
	            }else{
	            	$scope.hrEmplDtlDisabled=false;
	            }
	            if($scope.isEmpIdReq=="Y"){
	            	 $scope.hideForOtherOrgn = true;
                     $scope.requiredCorporationNo = true;
	            }else{
	            	 $scope.hideForOtherOrgn = false;
	            }
	            if($scope.hrEmplDtlDisabled){
	            	if($scope.m_name!=null){
	            		$scope.disableMiddleName=true;
	            	}else{
	            		$scope.disableMiddleName=false;
	            	}
	            }
	            var dataObjForTitle = {
	            	    codeSet: 'TITLE',
	            	    disabledCodeSets: [$scope.prefix]
	            };
	            $scope.getAllCodeSetsByTitle(dataObjForTitle);
	            var dataObjForCountry= {
	            	    codeSet: 'COUNTRY',
	            	    disabledCodeSets: [$scope.country]
	            	    
	            	};
	            $scope.getAllCodeSetsByCountry(dataObjForCountry);
	            var dataObjForNationality = {
	            	    codeSet: 'NATIONALITY',
	            	    disabledCodeSets: [$scope.nationality]
	            	};
	            $scope.getAllCodeSetsByNationality(dataObjForNationality);
	            var dataObjForGender = {
	            	    codeSet: 'GENDER',
	            	    disabledCodeSets: [$scope.gender]
	            	};
	            $scope.getAllCodeSetsByGender(dataObjForGender);
	        })
	        .error(function(data, status, headers, config) {
	            $scope.error = true;
	        });
	}
	 $scope.personalInfo();


	/******** fill the form data ends*******************/
	/***********save the user personal info data to Database on click of save*****************/
	$scope.savePersonalInfoDetails = function(form) {
	    angular.forEach(form, function(obj) {
	        if (angular.isObject(obj) && angular.isDefined(obj.$setDirty)) {
	            obj.$setDirty();
	        }
	    })

	    /*  if ($scope.highest_degree == undefined || $scope.highest_degree.match(/^\s*$/) || $scope.highest_degree == null || $scope.highest_degree == "") {
	          notif({
	              type: "error",
	              msg: "Please fill Highest Degree",
	              position: "center",
	              multiline: true,
	              timeout: 6000
	          });
	          return false;
	      }


	      if ($scope.f_name == undefined || $scope.f_name.match(/^\s*$/) || $scope.f_name == null || $scope.f_name == "") {
	          notif({
	              type: "error",
	              msg: "Please fill First Name",
	              position: "center",
	              multiline: true,
	              timeout: 6000
	          });
	          return false;
	      }

	      if ($scope.l_name == undefined || $scope.l_name.match(/^\s*$/) || $scope.l_name == null || $scope.l_name == "") {
	          notif({
	              type: "error",
	              msg: "Please fill Last Name",
	              position: "center",
	              multiline: true,
	              timeout: 6000
	          });
	          return false;
	      }*/

	    $scope.success = false;
	    $scope.failure = false;
	    $scope.error = false;
	    $scope.invalid = false;
	    $scope.isDisabled = true;
	    angular.forEach(form, function(obj) {
	        if (angular.isObject(obj) && angular.isDefined(obj.$setDirty)) {
	            obj.$setDirty();
	        }
	    })

	    $scope.userpersonalInfoDetails.prefix = $scope.prefix;
	    $scope.userpersonalInfoDetails.first_name = $scope.f_name;
	    $scope.userpersonalInfoDetails.middle_name = $scope.m_name;
	    $scope.userpersonalInfoDetails.last_name = $scope.l_name;
	    $scope.userpersonalInfoDetails.preferred_name = $scope.display_name;
	    $scope.userpersonalInfoDetails.corporation_no = $scope.corporation_no;
	    $scope.userpersonalInfoDetails.highest_degree = $scope.highest_degree;
	    $scope.userpersonalInfoDetails.country = $scope.country;
	    $scope.userpersonalInfoDetails.state = $scope.state;
	    $scope.userpersonalInfoDetails.city = $scope.city;
	    $scope.userpersonalInfoDetails.postal_code = $scope.postal_code;
	    $scope.userpersonalInfoDetails.primary_contact_no = $scope.primary_contact_no;
	    $scope.userpersonalInfoDetails.secondary_contact_no = $scope.secondary_contact_no;
	    $scope.userpersonalInfoDetails.fax = $scope.fax;
	    $scope.userpersonalInfoDetails.primary_email_id = $scope.primary_email_id;
	    $scope.userpersonalInfoDetails.secondary_email_id = $scope.secondary_email_id;
	    $scope.userpersonalInfoDetails.primary_communication = $scope.emailcommn;
	    $scope.userpersonalInfoDetails.primary_phone_communication = $scope.phone_commn;
	    $scope.userpersonalInfoDetails.recieve_email_notification = $scope.email_notification;
	    $scope.userpersonalInfoDetails.recieve_sms_notification = $scope.isSmsnotification;
	    $scope.userpersonalInfoDetails.bleep_no = $scope.bleep_no;
	    $scope.userpersonalInfoDetails.gender = $scope.gender;
	    $scope.userpersonalInfoDetails.nationality = $scope.nationality;


	    if (form.$valid) {
	        /******ajax call to the controller**********/
	        var dataObj = {
	            userProfileInfoData: $scope.userpersonalInfoDetails,
	            pageName: "personal_info"
	        };
	        var res = $http.post('update-user-profile-data', dataObj);
	        res.success(function(data, status, headers, config) {
	            $scope.message = data;
	            
	            if ($scope.message == true) {
	                notif({
	                    type: "success",
	                    msg: messages.personalInfoSuccess,
	                    multiline: true,
	                    position: "center",
	                    timeout: 6000
	                });
	               $scope.getLandingpageDetails();
	            } else {
	                notif({
	                    type: "error",
	                    msg: messages.personalInfoError,
	                    multiline: true,
	                    position: "center",
	                    timeout: 6000
	                });
	            }
	        });
	        res.error(function(data, status, headers, config) {
	            notif({
	                type: "warning",
	                msg: messages.personalInfoException,
	                multiline: true,
	                position: "center",
	                timeout: 6000
	            });

	        });
	    } else {
	        notif({
	            type: "warning",
	            msg: messages.personalInfoValidations,
	            multiline: true,
	            position: "center",
	            timeout: 6000
	        });
	        //$scope.invalid=true;
	    }
	}
	$scope.getLandingpageDetails=function(){
   		//location.href="landingpagePersonalInfo";
		//$rootScope.getFullName();
		//$rootScope.emailUnreadCount();
   	 var res = $http.get('landingpagePersonalInfo');
     res.success(function(data, status, headers, config) {
    	 $rootScope.fullDisplayName=data.fullName;
    	 $compile($('#user_full_name_header'))($rootScope);
    	 $compile($('#user_full_name_sidebar'))($rootScope);
     });
   		
   	}	
	$scope.uploadProfilePic = function() {
	    var image = $scope.myCroppedImage;
	    var file = dataURItoBlob(image, 'image/png');

	    function dataURItoBlob(image, type) {
	        // convert base64 to raw binary data held in a string
	        var byteString = atob(image.split(',')[1]);

	        // separate out the mime component
	        var mimeString = image.split(',')[0].split(':')[1].split(';')[0]

	        // write the bytes of the string to an ArrayBuffer
	        var ab = new ArrayBuffer(byteString.length);
	        var ia = new Uint8Array(ab);
	        for (var i = 0; i < byteString.length; i++) {
	            ia[i] = byteString.charCodeAt(i);
	        }
	        // write the ArrayBuffer to a blob, and you're done
	        var bb = new Blob([ab], {
	            type: type
	        });
	        return bb;
	    }
	    console.log('file is ');
	    console.dir(file);

	    var uploadUrl = "saveImage";
	    if (file != undefined) {
	        var type = file.type;
	        if (1 == 1) {
	            profilePicUpload.uploadProfilePic(file, uploadUrl, $scope);
	        } else {
	            notif({
	                type: "error",
	                msg: "Please select jpeg file",
	                multiline: true,
	                position: "center",
	                timeout: 6000
	            });

	            return false;
	        }
	    } else {
	        notif({
	            type: "warning",
	            msg: "Please select a jpeg file",
	            multiline: true,
	            position: "center",
	            timeout: 6000
	        });
	    }
	};


	/***********onlcick of next button to go to next page **********************/
	$scope.personalInfonext = function(form) {
	    angular.forEach(form, function(obj) {
	        if (angular.isObject(obj) && angular.isDefined(obj.$setDirty)) {
	            obj.$setDirty();
	        }
	    })
	    if (form.$valid) {

	        $scope.userpersonalInfoDetails.title = $scope.title;
	        $scope.userpersonalInfoDetails.first_name = $scope.f_name;
	        $scope.userpersonalInfoDetails.middle_name = $scope.m_name;
	        $scope.userpersonalInfoDetails.last_name = $scope.l_name;
	        $scope.userpersonalInfoDetails.display_name = $scope.display_name;
	        $scope.userpersonalInfoDetails.gender = $scope.personGender;
	        $scope.userpersonalInfoDetails.date_of_birth = $scope.birthDate;
	        $scope.userpersonalInfoDetails.nationality = $scope.person_nationality;
	        $scope.userpersonalInfoDetails.marital_status = $scope.person_maritalStatus;
	        $scope.userpersonalInfoDetails.alternate_email = $scope.alternate_email;
	        $scope.userpersonalInfoDetails.user_name = $scope.userId;

	        location.href = "#/password-management";

	    } else {
	        notif({
	            type: "warning",
	            msg: messages.personalInfoValidations,
	            multiline: true,
	            position: "center",
	            timeout: 6000
	        });
	        //$scope.invalid=true;
	    }

	}
	/*****************onclick of cancel button to cancel the profile filling */
	$scope.personalInfoCancel = function() {
	    swal({
	            title: "Are you sure?",
	            text: "If you cancel filled data will not be saved.",
	            type: "warning",
	            showCancelButton: true,
	            confirmButtonColor: "#DD6B55",
	            confirmButtonText: "Yes",
	            cancelButtonText: "No",
	            closeOnConfirm: false,
	            closeOnCancel: false
	        },
	        function(isConfirm) {
	            if (isConfirm) {
	                //implementation need to put
	                location.href = "update-user-profile";
	                swal("Cancelled!", "successfully");
	            } else {
	                swal("Not Cancelled");
	            }
	        });
	}}]);
/**************Institutional information page starts here**********************/

controllerModuleAPP.controller('institutional-information-controller', ['$scope', '$compile', 'userPersonalDetails', '$http', 'cvUpload', '$rootScope', 'componentService', 'highlightTableRowService', 'dateConvert','NewCodeSetServiceJS','documentValidation', function($scope, $compile, userPersonalDetails, $http, cvUpload, $rootScope, componentService, highlightTableRowService, dateConvert,NewCodeSetServiceJS,documentValidation) {
    var requestedUrl = "url";
    var  URL = window.location.href;
    requestedUrl  =  URL.substring(URL.lastIndexOf('/')  +  1);
    URL = "/" + requestedUrl;
    componentService.getSessionDataInPage($scope, URL);
    $scope.$MyService = componentService;
    $scope.$MyNewCodeSetServiceJS =NewCodeSetServiceJS;
    $scope.counter = 0;
    $scope.enrollementEnd = false;
    $scope.isCurrentEmp = false;
    /*$scope.change = function() {
      $scope.counter++;
      if(Number($scope.counter)%2==1)
      	{
      	  //$scope.enrollementEnd=true;
      	 // $scope.enrollmentEndVal='';
      	}
      else
      	{
      	$scope.enrollementEnd = false;
      	}
    };*/

    var institutionalInformationId = 0;
    $scope.genericMethod = function() {
        $http({
                method: 'GET',
                url: 'get-institutional-info-page-data'
            })
            .success(function(data, status, headers, config) {
                $scope.uderDetails = data;
                $scope.cvNameInstitution = data.institutionalDetails.uploaded_CV_name;
                $scope.cvNameDisplay = data.institutionalDetails.fileName;
                $scope.institutionalTableInformation = data.institutionalDetails.institutionalInformation;
                $('#institutionlInfo').bootstrapTable({
                    data: $scope.institutionalTableInformation
                });
                $('#institutionlInfo').bootstrapTable('load', $scope.institutionalTableInformation);
                userPersonalDetails.setData($scope.uderDetails);
                $scope.institutionalInformationdata = userPersonalDetails.data;
                $scope.userIstitutionalDetailsData = $scope.institutionalInformationdata.institutionalDetails;
                $scope.userIstitutionalData = $scope.userIstitutionalDetailsData.institutionalInformation;
                /*$scope.cvNameInstitution=$scope.userIstitutionalDetailsData.institutionalInformation[0].uploaded_CV_name;*/

                $scope.addBubbleDataForInstitutionalInfo($scope.institutionalTableInformation);
                dateConvert
            })
            .error(function(data, status, headers, config) {

            });
    }
    $scope.addBubbleDataForInstitutionalInfo = function(data) {
        $("#institutionlInfoBubble").empty();
        var j = 0;
        for (i in data) {
            j++;
            var tempValueinstitutional = "tempValueinstitutional" + i;
            $scope.tempinstitutional = "tempValueinstitutional" + i;
            $scope.institutionalInfoData = data[i];
            $scope[tempValueinstitutional] = data[i]; //asif
            /*	 var inputbox="<div class='"+$scope.colors[i]+"'><div class='inner'><p>Affilated institution: "+$scope.institutionalInfoData.designation+"</p><p>Section: "+$scope.institutionalInfoData.section_shortDesc+"</p><p>Department: "+$scope.institutionalInfoData.department_shortDesc+"</p>"+
	   			"<div class='icon'><i class='ion ion-bag'></i></div> <a ng-click='fillDataIntoForm("+ $scope.tempinstitutional+")' class='small-box-footer'>More info <i class='fa fa-arrow-circle-right'></i></a></div></div>";
	 */
            var inputbox = "<div class='col-md-3 col-sm-6 col-xs-12 bubblesboxw'> <div class='info-box'> <span class='info-box-icon bg-aqua'><p class='fa fa-fw fa-sun-o iconcenter'></p><p class='iconcentertextnum'>" + (j) + "</p></span> <div class='info-box-content'> <span class='info-box-number'>" + $scope.institutionalInfoData.affiliated_institution_shortDesc + "</span> <span class='info-box-text'>" + $scope.institutionalInfoData.designation_desc + "</span> <span class='info-box-text'>" + $scope.institutionalInfoData.department_shortDesc + "</span><a ng-click='fillDataIntoForm(" + $scope.tempinstitutional + ")' class='small-box-footer moreinfomit' title='More info'><i class='fa fa-arrow-circle-right'></i></a> </div></div> </div>";
            $("#institutionlInfoBubble").append(inputbox);

        }
        $compile($('#institutionlInfoBubble'))($scope);

    }
    $scope.fillDataIntoForm = function(row) {
        $.confirm({
            title: mesaages.areusure,
            content_box: mesaages.editmsg,
            confirm: function() {
                $scope.selected = row;
                $scope.showorhideupdate = true;
                $scope.showorhidecancelupdate = true;
                $scope.showorhideadd = false;
                $scope.designation = $scope.selected.designation;
                $scope.section = $scope.selected.section_shortDesc;
                $scope.department = $scope.selected.department;
                $scope.affiliated_institution = $scope.selected.affiliated_institution;
                $scope.getFacilityAndCoutryFromOrg($scope.affiliated_institution);
                $scope.affiliated_institution_country = $scope.selected.affiliated_institution_country;
                $scope.fecility = $scope.selected.fecility;

                // $scope.affiliatedinstitution
                institutionalInformationId = $scope.selected.institutional_information_id;
                $scope.counter = 0;
                $scope.enrollmentStartVal = $scope.selected.from_date;
                if ($scope.selected.is_current_emp == "Yes") {
                    $scope.isCurrentEmp = true;

                } else {
                    $scope.isCurrentEmp = false;
                }
                $scope.enrollmentEndVal = $scope.selected.to_date;
                $scope.$apply()
                $(".back-to-top").trigger("click");
            }
        });
    }
    $scope.genericMethod();
    $scope.getInstitutionName = function(institution) {
        $scope.affiliated_institution_country = $scope.affiliatedInstitutionDetails.country_shortDesc;
        if (institution != undefined) {
            var orgData = {
                orgCode: institution
            };
            var facility = $http.post('get-childorg-by-parentorg', orgData);
            facility.success(function(data, status, headers, config) {
                if (data.length > 0) {
                    $scope.facilityDetails = data;
                }

            })
            facility.error(function(data, status, headers, config) {});

            if (institution == "Other" || institution == "other") {
                $scope.hidecolumn = false;
            } else {
                $scope.hidecolumn = true;
            }
        }

    }
    $scope.hideFacilitySelect = true;
    $scope.isOrgSameInSignup = false;
    $scope.disablePrimaryInstituteCheckBox = true;
    $scope.getFacilityAndCoutryFromOrg = function(orgName) {
            if (orgName == "HMCQA") {
                $scope.hideFacilitySelect = false;
                $scope.getInstitutionName(orgName);
            } else {
                $scope.hideFacilitySelect = true;
                $scope.fecility="";
            }
            $scope.signUpOrgName = sessionStorage.getItem("organization");
            if ($scope.signUpOrgName == orgName) {
                $scope.isOrgSameInSignup = true;
                $scope.disablePrimaryInstituteCheckBox = false;
                $scope.isCurrentEmp = true;
            } else {
                $scope.isOrgSameInSignup = false;
                $scope.disablePrimaryInstituteCheckBox = true;
                $scope.isCurrentEmp = false;
            }
            $.each($scope.affiliatedInstitutionDetailsData, function(key, value) {
                if (orgName == value.codeSet) {
                	$scope.countryshortDesctit=value.country_shortDesc;
                    $scope.affiliated_institution_country = value.country;
                }

            });
        }
        /*$scope.countryForFacilityInstitution=function(institution,facility){
		if(institution != undefined && facility!=undefined){
			var orgData = {
					inst_facility 		: 	facility,
					institution			: institution
			};
			 var res = $http.post('get-country-state-fr-facility', orgData);
			 res.success(function(data, status, headers, config) {
				 if(data.length > 0){
					 $scope.country = data;
					 $scope.affiliated_institution_country=data[0].codeSet;
					$scope.affiliatedInstitutionCountryDetails=data;
				 }else{
					 $scope.affiliatedInstitutionCountryDetails=$scope.country
				 }
			 });
			 res.error(function(data, status, headers, config) {
			  });
			 
		}
	}
	
	$scope.getInstitutionNameForFacility=function(institutionName){
		if(institutionName != undefined){
			var orgData = {
					orgCode 		: 	institutionName
			};
			 var facility = $http.post('get-parentorg-by-childorg', orgData);
			 facility.success(function(data, status, headers, config) {
				// $scope.affiliatedInstitutionDetails = data;
				 if(data.length > 0){
					 $scope.affiliatedInstitutionDetails = data;
				 }else{
					 $scope.affiliatedInstitutionDetails = $scope.affiliatedInstitutionDetailsData;
				 }
			 })
			 facility.error(function(data, status, headers, config) {
			  });
		}else{
			$scope.affiliatedInstitutionDetails = $scope.affiliatedInstitutionDetailsData;
			$scope.facilityDetails = $scope.facilityDetailsData;
		}
		
		
  		
 	}*/
        //code starts to get the drop down for the "section"
    var sharingSectionModeObject = {
        codeSet: 'SECTION'
    }
    $scope.getAllCodeSetsBySection=function(codesetData){
    	NewCodeSetServiceJS.getAllCodeSetsByType(codesetData)
         .then(function (data) {
        	 $scope.sectionDetails = data.codeSetsEntity;
        	 //alert("getAllCodeSetsByCodeSetType Success:"+$scope.departmentDetails);
         },
         function (errorMessage) {
            //alert("getAllCodeSetsByCodeSetType Error Message:"+errorMessage);
         });
    }
    $scope.getAllCodeSetsBySection(sharingSectionModeObject);
    //code ends to get the drop down for the "section"
    var jobTitles = {
            codeSet: 'JOB'
        }
        $scope.getAllCodeSetsByJob=function(codesetData){
        	NewCodeSetServiceJS.getAllCodeSetsByType(codesetData)
             .then(function (data) {
            	 $scope.designationList = data.codeSetsEntity;
            	 //alert("getAllCodeSetsByCodeSetType Success:"+$scope.departmentDetails);
             },
             function (errorMessage) {
                //alert("getAllCodeSetsByCodeSetType Error Message:"+errorMessage);
             });
        }
        $scope.getAllCodeSetsByJob(jobTitles);
    //code starts to get the drop down for the "department"
    var sharingDeptModeObject = {
        codeSet: 'DEPARTMENT'
    }
    $scope.getAllCodeSetsByCodeSetType=function(codesetData){
    	NewCodeSetServiceJS.getAllCodeSetsByType(codesetData)
         .then(function (data) {
        	 $scope.departmentDetails = data.codeSetsEntity;
        	 //alert("getAllCodeSetsByCodeSetType Success:"+$scope.departmentDetails);
         },
         function (errorMessage) {
            //alert("getAllCodeSetsByCodeSetType Error Message:"+errorMessage);
         });
    }
    $scope.getAllCodeSetsByCodeSetType(sharingDeptModeObject);

    //loading the AFFILIATED_INSTITUTION of organization type to AFFILIATED_INSTITUTION dropdown
    $scope.affiliatedInstitutionDetailsData1 = [];
    $scope.affiliatedInstitutionDetails1 = [];
    $scope.affiliatedInstitutionDetailsData = [];
    $scope.affiliatedInstitutionDetails = [];
    var orgTypeData = {
        orgType: "ORGN_TYPE_11"
    };
    var orgDataList = $http.post('get-org-by-orgtype', orgTypeData);
    orgDataList.success(function(data, status, headers, config) {
    	$scope.getOrgDataByType();
        $scope.affiliatedInstitutionDetailsData1 = data;
        $scope.affiliatedInstitutionDetails1 = data;
        //$scope.getOrgDataByType();
    })
    orgDataList.error(function(data, status, headers, config) {});
    //loading the ORGN_TYPE_131
    $scope.getOrgDataByType=function(){
    	 var orgTypeData = {orgType: "ORGN_TYPE_131"};
    	 var orgDataList1 = $http.post('get-org-by-orgtype', orgTypeData);
    	 orgDataList1.success(function(data, status, headers, config) {
    		 $scope.orgDataType131 = data;
    		 if($scope.orgDataType131!=null && $scope.orgDataType131!=undefined && $scope.orgDataType131.length>0){
    			// $scope.affiliatedInstitutionDetails1.push($scope.orgDataType131);
    			 for(var i=0;i<$scope.orgDataType131.length;i++){
    				// $scope.affiliatedInstitutionDetailsData1.push($scope.orgDataType131[i]);
    	    		 $scope.affiliatedInstitutionDetails1.push($scope.orgDataType131[i]);
    			 }
    		 }
    		 $scope.affiliatedInstitutionDetailsData =$scope.affiliatedInstitutionDetailsData1;
			 $scope.affiliatedInstitutionDetails = $scope.affiliatedInstitutionDetails1;
    	});
    	orgDataList1.error(function(data, status, headers, config) {
    		
    	});
    }
   
    var sharingCountryModeObject = {
        codeSet: 'COUNTRY'
    }
    $scope.getAllCodeSetsByCountry=function(codesetData){
    	NewCodeSetServiceJS.getAllCodeSetsByType(codesetData)
         .then(function (data) {
        	 $scope.affiliatedInstitutionCountryDetails = data.codeSetsEntity;
        	 //alert("getAllCodeSetsByCodeSetType Success:"+$scope.departmentDetails);
         },
         function (errorMessage) {
            //alert("getAllCodeSetsByCodeSetType Error Message:"+errorMessage);
         });
    }
    $scope.getAllCodeSetsByCountry(sharingCountryModeObject);
    
    $scope.hidecolumn = true;
    $scope.is_hr_interface_enabled=false;
    window.actionEvents = {
        'click .edit': function(e, value, row, index) {
            $.confirm({
                title: mesaages.areusure,
                content_box: mesaages.editmsg,
                confirm: function() {
                    highlightTableRowService.highlightcolor(e);
                    $scope.selected = row;
                    $scope.showorhideupdate = true;
                    $scope.is_hr_interface_enabled=$scope.selected.isHrEnabled
                    $scope.showorhidecancelupdate = true;
                    $scope.showorhideadd = false;
                    $scope.designation = $scope.selected.designation;
                    $scope.section = $scope.selected.section_shortDesc;
                    $scope.department = $scope.selected.department;
                    $scope.affiliated_institution = $scope.selected.affiliated_institution;
                    $scope.getFacilityAndCoutryFromOrg($scope.affiliated_institution);
                    $scope.affiliated_institution_country = $scope.selected.affiliated_institution_country;


                    if ($scope.hideFacilitySelect == false) {
                        $scope.fecility = $scope.selected.fecility;
                    }

                    // $scope.affiliatedinstitution
                    institutionalInformationId = $scope.selected.institutional_information_id;
                    $scope.counter = 0;
                    $scope.enrollmentStartVal = $scope.selected.from_date;
                    if ($scope.selected.is_current_emp == "Yes") {
                        $scope.isCurrentEmp = true;

                    } else {
                        $scope.isCurrentEmp = false;
                    }
                    $scope.enrollmentEndVal = $scope.selected.to_date;
                    $scope.$apply()
                    $(".back-to-top").trigger("click");
                }
            });
        },

        'click .remove': function(e, value, row, index) {
            $.confirm({
                title: mesaages.areusure,
                content_box: mesaages.deleterecord,
                confirm: function() {

                    $scope.selected = row;
                    institutionalInformationId = $scope.selected.institutional_information_id;
                    if ($scope.selected.is_current_emp == "Yes") {
                        $scope.isCurrentEmp = true;
                    } else {
                        $scope.isCurrentEmp = false;
                    }
                    var dataObj = {
                        designation: $scope.selected.designation,
                        section: $scope.selected.section,
                        department: $scope.selected.department,
                        fecility: $scope.selected.fecility,
                        affiliated_institution: $scope.selected.affiliated_institution,
                        affiliated_institution_country: $scope.selected.affiliated_institution_country,
                        institutional_information_id: institutionalInformationId,
                        from_date: dateConvert.convertDateToMiliSecondForProfile($scope.selected.from_date),
                        to_date: dateConvert.convertDateToMiliSecondForProfile($scope.selected.to_date),
                        is_current_emp: $scope.isCurrentEmp,
                        is_deleted: true,
                        pageName: "institutional_information"
                    };

                    var res = $http.post('update-user-profile-data', dataObj);
                    res.success(function(data, status, headers, config) {
                        $scope.message = data;
                        if ($scope.message == true) {
                            notif({
                                type: "success",
                                msg: mesaages_inst_info_dlt_success,
                                multiline: true,
                                position: "center",
                                timeout: 6000
                            });
                            $scope.designation = '',
                                $scope.section = '',
                                $scope.department = '',
                                $scope.fecility = '',
                                $scope.affiliated_institution = '',
                                $scope.affiliated_institution_country = '',
                                institutionalInformationId = 0;
                            $scope.institutionlInfo.$setPristine(true);
                            $scope.showorhideupdate = false;
                            $scope.showorhidecancelupdate = false;
                            $scope.showorhideadd = true;
                            $scope.isCurrentEmp = false;
                            $scope.enrollmentStartVal = '';
                            $scope.enrollmentEndVal = '';
                            $scope.enrollementEnd = false;
                            $scope.counter = 0;
                            $scope.genericMethod();
                        } else {
                            notif({
                                type: "error",
                                msg: mesaages_inst_info_not_dlt_plz_cont_adm,
                                position: "center",
                                multiline: true,
                                timeout: 6000
                            });
                        }
                    });
                    res.error(function(data, status, headers, config) {
                        notif({
                            type: "error",
                            msg: mesaages_somth_wrog_plz_cont_adm,
                            multiline: true,
                            position: "center",
                            timeout: 6000
                        });
                    });
                }
            });
        }
    };
    $scope.saveOrUpdateUesrInstitutionalInformation = function(form) {
        angular.forEach(form, function(obj) {
            if (angular.isObject(obj) && angular.isDefined(obj.$setDirty)) {
                obj.$setDirty();
            }
        })
        if (form.$valid) {
            // From date
            /*if($scope.enrollmentStartVal == undefined || $scope.enrollmentStartVal=="") {
		    		notif({
						type : "error",
						msg : messages.fromDateSelect,
						position : "center",
						multiline : true,
						timeout : 6000
					});
		    		return false;
		    	}
		    	if(!$scope.isCurrentEmp && ( $scope.enrollmentEndVal ==  undefined  || $scope.enrollmentEndVal=="")){
		    		notif({
						type : "error",
						msg : messages.toDateSelect,
						position : "center",
						multiline : true,
						timeout : 6000	
					});
		    		return false;
		    		
		    	}*/
            if ($scope.hideFacilitySelect == false) {
                if ($scope.fecility == "" || $scope.fecility == null || $scope.fecility == undefined) {
                    notif({
                        type: "error",
                        msg: mesaages.selectFacility,
                        position: "center",
                        multiline: true,
                        timeout: 6000
                    });
                    return false;
                }
            }
            $scope.fromDate = dateConvert.convertDateToMiliSecondForProfile($scope.enrollmentStartVal);
            $scope.toDate = dateConvert.convertDateToMiliSecondForProfile($scope.enrollmentEndVal);
            if ($scope.isCurrentEmp) {
                var isCurrentExist = false;
                for (var i = 0; i < $scope.institutionalTableInformation.length; i++) {
                    if ($scope.institutionalTableInformation[i].is_current_emp == "Yes" && $scope.institutionalTableInformation[i].institutional_information_id != institutionalInformationId) {
                        isCurrentExist = true;
                        break;
                    }

                }
                if (isCurrentExist == true) {
                    notif({
                        type: "warning",
                        msg: messages.currentEmp,
                        position: "center",
                        timeout: 3000
                    });
                    return false;
                }


            }
            if ($scope.isOrgSameInSignup) {
                if ($scope.isCurrentEmp == false) {
                    notif({
                        type: "error",
                        msg: mesaages.selectPrimaryInsti,
                        position: "center",
                        multiline: true,
                        timeout: 6000
                    });
                    return false;
                }
            }
            var todayDate = dateConvert.checkForTodayDate();
            if (Number($scope.fromDate) > Number(dateConvert.convertDateToMiliSecondForProfile(todayDate))) {
                notif({
                    type: "error",
                    msg: messages.fromDateError,
                    position: "center",
                    multiline: true,
                    timeout: 6000
                });
                return false;
            }

            if (Number($scope.counter) % 2 == 0 && Number($scope.toDate) > Number(dateConvert.convertDateToMiliSecondForProfile(todayDate))) {
                notif({
                    type: "error",
                    msg: messages.toDateError,
                    position: "center",
                    multiline: true,
                    timeout: 6000
                });
                return false;
            }

            if (Number($scope.counter) % 2 == 0 && $scope.fromDate > $scope.toDate) {
                //alert("Start date should not be greater than end date");
                notif({
                    type: "error",
                    msg: messages.startdateshouldnotbegreaterthanenddate,
                    position: "center",
                    multiline: true,
                    timeout: 6000
                });
                return false;

            }

            var dataObj = {
                userProfileInfoData: $scope.institutionList,
                designation: $scope.designation,
                section: $scope.section,
                department: $scope.department,
                fecility: $scope.fecility,
                affiliated_institution: $scope.affiliated_institution,
                affiliated_institution_country: $scope.affiliated_institution_country,
                institutional_information_id: institutionalInformationId,
                is_deleted: false,
                pageName: "institutional_information",
                is_current_emp: $scope.isCurrentEmp,
                from_date: dateConvert.convertDateToMiliSecondForProfile($scope.enrollmentStartVal),
                to_date: dateConvert.convertDateToMiliSecondForProfile($scope.enrollmentEndVal)
            };
            var res = $http.post('update-user-profile-data', dataObj);
            res.success(function(data, status, headers, config) {
                $scope.message = data;
                if ($scope.message == true) {
                    notif({
                        type: "success",
                        msg: messages.institutionalInfoSuccess,
                        multiline: true,
                        position: "center",
                        timeout: 6000
                    });
                    $scope.showorhideupdate = false;
                    $scope.showorhidecancelupdate = false;
                    $scope.showorhideadd = true;
                    $scope.genericMethod();
                    $scope.designation = '';
                    $scope.section = '';
                    $scope.department = '';
                    $scope.fecility = '';
                    $scope.affiliated_institution = '';
                    institutionalInformationId = 0;
                    $scope.affiliated_institution_country = '';
                    $scope.isCurrentEmp = false;
                    $scope.enrollmentStartVal = '';
                    $scope.enrollmentEndVal = '';
                    $scope.enrollementEnd = false;
                    $scope.counter = 0;
                    $scope.institutionlInfo.$setPristine(true);
                } else {
                    notif({
                        type: "error",
                        msg: messages.institutionalInfoError,
                        position: "center",
                        multiline: true,
                        timeout: 6000
                    });
                }
            });
            res.error(function(data, status, headers, config) {
                notif({
                    type: "error",
                    msg: messages.institutionalInfoException,
                    multiline: true,
                    position: "center",
                    timeout: 6000
                });
            });
        } else {
            notif({
                type: "warning",
                msg: messages.kindlyfilldata,
                multiline: true,
                position: "center",
                timeout: 6000
            });
            $scope.isDisabled = false;
            $scope.enrollementEnd = false;
            $scope.counter = 0;
            //$scope.invalid=true;
        }
    }


    //sb
    if ($scope.upload_image == "upload_image") {
        /*if($scope.myFile==undefined || $scope.myFile==null){
			 notif({
				  type: "warning",
				  msg: mesaages.plz_slt_file_upload,
				  multiline:true,
				  position: "center",
				  timeout: 5000
				});
			 return false; 
		 }*/
        if ($scope.myFile != undefined && $scope.myFile != "" && $scope.myFile != "No file") {
            var type = $scope.myFile.type;
            var array = [];
            var result = "";
            var typesAllowedInUpload = mesaages.typeOfDocsToUpload;
            $scope.isSpecialChar= documentValidation.checkForSpecialChar(file);
            if($scope.isSpecialChar==false){
       		 notif({
					type : "warning",
					msg : messageDefault.fileSpecChar,
					position : "center",
					multiline: true,
					timeout : 6000,
					autohide: true
				});
			 return false;
            }
            $scope.isDocName= documentValidation.checkForDocumentNameLenght(file);
            if($scope.isDocName==false){
            	notif({
					type : "warning",
					msg : messageDefault.fileLength,
					position : "center",
					multiline: true,
					timeout : 6000,
					autohide: true
				});
   			 return false;
               }
            array = typesAllowedInUpload.split(",");

            for (var i = 0; i < array.length; i++) {
                if (type == array[i]) {
                    result = "success";
                }
            }
            if (result != "success") {
                notif({
                    type: "warning",
                    msg: mesaages.typeOfDocsToUploadWarning,
                    position: "center",
                    multiline: true,
                    timeout: 6000,
                    autohide: true
                });
                return false;
            }
        } else {}
    }
    //
    $scope.uploadFile = function() {
        var file = $scope.myFile;

        console.log('file is ');
        console.dir(file);

        var uploadUrl = "upload-cv";
        if (file != undefined && file != "" && file != "No file") {
            var type = file.type;
            var size = file.size;
            var testsize = mesaages.maxsize;
            
            $scope.isSpecialChar= documentValidation.checkForSpecialChar(file);
            if($scope.isSpecialChar==false){
          		 notif({
   					type : "warning",
   					msg : messageDefault.fileSpecChar,
   					position : "center",
   					multiline: true,
   					timeout : 6000,
   					autohide: true
   				});
   			 return false;
             }
            $scope.isDocName= documentValidation.checkForDocumentNameLenght(file);
            if($scope.isDocName==false){
            	notif({
					type : "warning",
					msg : messageDefault.fileLength,
					position : "center",
					multiline: true,
					timeout : 6000,
					autohide: true
				});
   			 return false;
               }
            if (type == "application/vnd.openxmlformats-officedocument.wordprocessingml.document" || type == "application/msword" || type == "application/pdf") {
                if (size < testsize) {
                    cvUpload.uploadFileToUrl(file, uploadUrl, $scope);
                } else {
                    notif({
                        type: "warning",
                        msg: mesaages.plz_slt_doc_size,
                        multiline: true,
                        position: "center",
                        timeout: 6000
                    });

                    return false;
                }
            } else {
                notif({
                    type: "warning",
                    msg: mesaages.plz_slt_doc_file,
                    multiline: true,
                    position: "center",
                    timeout: 6000
                });

                return false;
            }
           

        } else {
            notif({
                type: "error",
                msg: mesaages.plz_slt_file,
                multiline: true,
                position: "center",
                timeout: 6000
            });

            return false;
        }

    };


    //sb	

    $scope.instiutionalCancel = function(form) {
        highlightTableRowService.removeHighlight();
        $scope.designation = '',
            $scope.section = '',
            $scope.department = '',
            $scope.fecility = '',
            $scope.affiliated_institution = '',
            $scope.affiliated_institution_country = '',
            $scope.institutionlInfo.$setPristine(true);
        $scope.showorhideupdate = false;
        $scope.showorhidecancelupdate = false;
        $scope.showorhideadd = true;
        institutionalInformationId = 0;
        $scope.isCurrentEmp = false;
        $scope.enrollmentStartVal = '';
        $scope.enrollmentEndVal = '';
        $scope.enrollementEnd = false;
        $scope.counter = 0;
        $scope.is_hr_interface_enabled=false;
        $scope.hideFacilitySelect = true;
    }

    $scope.cancelUpload = function() {
        angular.element("input[type='file']").val(null);
    }

}]);


/**************Institutional information page ends here**********************/
/**************Areas of Interest page starts here**********************/
controllerModuleAPP.controller('areaofinterest-page-controller', ['$scope', 'userPersonalDetails', '$http', '$compile', '$rootScope', 'componentService', 'highlightTableRowService','keyWordService','NewCodeSetServiceJS', function($scope, userPersonalDetails, $http, $compile, $rootScope, componentService, highlightTableRowService,keyWordService,NewCodeSetServiceJS) {

    /**
     * access control module code
     */
    var  URL = window.location.href;
    requestedUrl  =  URL.substring(URL.lastIndexOf('/')  +  1);
    URL = "/" + requestedUrl;
    componentService.getSessionDataInPage($scope, URL);
    $scope.MyNewCodeSetServiceJS=NewCodeSetServiceJS;
    $scope.$MyService = componentService;
    $rootScope.keywords="";
    // finished
    /*myData contains the values of form data*/
    $scope.success = false;
    $scope.failure = false;
    $scope.error = false;
    $scope.invalid = false;
    $scope.isDisabled = false;
    $scope.showorhideupdate = false;
    $scope.showorhideadd = true;
    $scope.areaOfInterestId = 0;
    $scope.reviewer = "No";
    $scope.isKeywordDisabled = false;
    $scope.areaOfInterestData = userPersonalDetails.data.areaOfInterestDetails;
    // keywords search implementation
   
    $scope.getDefaultKeywordsValue = function() {
        var orgTypeData = {
            categoryType: "KEYWORDS",
            categoryKey: "DISPLAY"
        };
        var orgDataList = $http.post('get-default-value-from-setting', orgTypeData);
        orgDataList.success(function(data, status, headers, config) {
            $scope.defaultKeywordDisplay = data.orgName;
            if ($scope.defaultKeywordDisplay == "READONLY") {
                $scope.isKeywordDisabled = true;
            }
        })
        orgDataList.error(function(data, status, headers, config) {
            $scope.error = true;
        });
    }
    $scope.getDefaultKeywordsValue();
    // end for keywords imeplementation

    //code starts to get the drop down for the "section"
    var sharingResAreaModeObject = {
        codeSet: 'RESEARCH_AREA'
    }
    $scope.getAllCodeSetsByResearchArea=function(codesetData){
    	NewCodeSetServiceJS.getAllCodeSetsByType(codesetData)
         .then(function (data) {
        	 $scope.researchArea = data.codeSetsEntity;
        	 //alert("getAllCodeSetsByCodeSetType Success:"+$scope.departmentDetails);
         },
         function (errorMessage) {
            //alert("getAllCodeSetsByCodeSetType Error Message:"+errorMessage);
         });
    }
    $scope.getAllCodeSetsByResearchArea(sharingResAreaModeObject);
    //code ends to get the drop down for the "section"
    /*	$scope.researchArea = [
    		   	                {r_area: 'Heart'},
    		   	                {r_area: 'Brain'}
    		   	            ];*/


    var sharingResSpecialtyModeObject = {
        /*codeSet		: 	'SPECIALITY'*/
        codeSet: 'RESEARCH_SPECIALTY',
		codeSetEnbOrDisbValue: 1
    }
    $scope.getAllCodeSetsByResearchSpeciality=function(codesetData){
    	NewCodeSetServiceJS.getAllCodeSetsByType(codesetData)
         .then(function (data) {
        	 $scope.specialityList = [];
             $scope.specialityList = data.codeSetsEntity;
         },
         function (errorMessage) {
            //alert("getAllCodeSetsByCodeSetType Error Message:"+errorMessage);
         });
    }
 //   $scope.getAllCodeSetsByResearchSpeciality(sharingResSpecialtyModeObject);
    /*  $scope.specialityList = [
           	                {speciality: 'Cordio'},
           	                {speciality: 'Nurology'}
           	            ]; */


    $scope.getResearchSpecialityByArea = function(area)
    {
        if (area != 'Please Select' || area != undefined)
        {
            var dataObjForCourse = {
                codeSet: area
            };
            var res = $http.post('getCodeSetByParentCodeSetextra', dataObjForCourse);
            res.success(function(data, status, headers, config)
            {
                /*$scope.research_speciality='';*/
                $scope.specialityList = [];
                $scope.specialityList = data;
                if ($scope.specialityList.length == 0 || $scope.specialityList.length == undefined)
                {
                    $scope.specialityNotApplicableTemp = {};
                    $scope.specialityNotApplicableTemp.codeSet = 'Not Applicable';
                    $scope.specialityNotApplicableTemp.shortDesc = 'Not Applicable';
                    $scope.specialityList.push($scope.specialityNotApplicableTemp);
                }
            });
            res.error(function(data, status, headers, config) {});
        }
    }
    var sharingModeObject = {
        /*codeSet		: 	'SUB_SPECIALITY'*/
        codeSet: 'RESEARCH_SPECIALTY'
    }
    var res = $http.post('getCodeSetByCodeSetType', sharingModeObject);
    res.success(function(data, status, headers, config) {
        $scope.subSpeciality = [];
        $scope.subSpeciality = data.codeSetsEntity;

    });
    res.error(function(data, status, headers, config) {

    });
    /* $scope.subSpeciality = [
          	                {sub_speciality: 'engio'},
          	                {sub_speciality: 'neuro'}
          	            ];*/

    $scope.genericMethod = function() {
        $http({
                method: 'GET',
                url: 'get-area-of-interest-page-data'
            })
            .success(function(data, status, headers, config) {
                $scope.areaOfInterestData = data.areaOfInterestDetails.areaOfInterestInformation;
                $('#areaofinterest').bootstrapTable({
                    data: $scope.areaOfInterestData
                });
                $('#areaofinterest').bootstrapTable('load', $scope.areaOfInterestData);
                $scope.addBubbleDataForAreaOfIntrest($scope.areaOfInterestData);
            })
            .error(function(data, status, headers, config) {
                $scope.error = true;
            });
    }

    $scope.addBubbleDataForAreaOfIntrest = function(data) {
        $("#areaofinterestBubble").empty();
        var j = 0;
        for (var i in data) {
            j++;
            var tempValueArea = "tempValueArea" + i;
            $scope.tempArea = "tempValueArea" + i
            $scope.areaOfInterestData = data[i];
            console.log($scope.areaOfInterestData);
            $scope[tempValueArea] = data[i];
            var inputbox = "<div class='col-lg-3 col-md-4 bubblesboxw'> <div class='info-box'> <span class='info-box-icon bg-aqua'><p class='fa fa-fw fa-sun-o iconcenter'></p><p class='iconcentertextnum'>" + (j) + "</p></span> <div class='info-box-content'> <span class='info-box-number'>" + $scope.areaOfInterestData.research_area_shortDesc + "</span>  <span class='info-box-text'>" + /*$scope.areaOfInterestData.sub_speciality_shortDesc*/ "" + "</span></div><a ng-click='fillDataIntoForm(" + $scope.tempArea + ")' class='small-box-footer moreinfomit' title='More Info'><i class='fa fa-arrow-circle-right'></i></a></div> </div>";

            $("#areaofinterestBubble").append(inputbox);

        }
        $compile($('#areaofinterestBubble'))($scope);

    }
    $scope.fillDataIntoForm = function(row) {
        $.confirm({
            title: mesaages.areusure,
            content_box: mesaages.editmsg,
            confirm: function() {
                $scope.showorhideupdate = true;
                $scope.showorhideadd = false;
                $scope.showorhidecancelupdate = true;
                $scope.selected = row;
                //$scope.indexvalue=index;
                $scope.r_area = $scope.selected.research_area;
                $scope.speciality = $scope.selected.speciality;
                // $scope.sub_speciality=$scope.selected.sub_speciality;
                $rootScope.keywords = $scope.selected.keyword1
                $scope.research_interest = $scope.selected.research_interest;
                $scope.reviewer = $scope.selected.reviewer;
                $scope.areaOfInterestId = $scope.selected.area_of_interest_id;
                var resAreaWithDisableValues = {
                        codeSet: 'RESEARCH_AREA',
                        disabledCodeSets: [$scope.r_area]
                    }
                $scope.getAllCodeSetsByResearchArea(resAreaWithDisableValues);
                var resSpecailityWithDisableValues = {
                        codeSet: 'RESEARCH_SPECIALTY',
                        disabledCodeSets: [$scope.speciality]
                    }
//                $scope.getAllCodeSetsByResearchSpeciality(resSpecailityWithDisableValues);
                $scope.getResearchSpecialityByArea($scope.r_area);
                $scope.$apply()
                $(".back-to-top").trigger("click");


            }
        });
    }
    $scope.genericMethod();
    window.actionEvents = {
        'click .edit': function(e, value, row, index) {
            $.confirm({
                title: mesaages.areusure,
                content_box: mesaages.editmsg,
                confirm: function() {
                    highlightTableRowService.highlightcolor(e);
                    $scope.showorhideupdate = true;
                    $scope.showorhideadd = false;
                    $scope.showorhidecancelupdate = true;
                    $scope.selected = row;
                    $scope.indexvalue = index;
                    $scope.r_area = $scope.selected.research_area;
                    $scope.speciality = $scope.selected.speciality;
                    $scope.getResearchSpecialityByArea($scope.r_area);
                    // $scope.sub_speciality=$scope.selected.sub_speciality;
                    $rootScope.keywords = $scope.selected.keyword1
                    $scope.research_interest = $scope.selected.research_interest;
                    $scope.reviewer = $scope.selected.reviewer;
                    $scope.areaOfInterestId = $scope.selected.area_of_interest_id;
                    $scope.$apply()
                    $(".back-to-top").trigger("click");


                }
            });
        },

        'click .remove': function(e, value, row, index) {
            $.confirm({
                title: mesaages.areusure,
                content_box: mesaages.deletemsg,
                confirm: function() {

                    $scope.selected = row;
                    var dataObj = {
                        research_area: $scope.selected.research_area,
                        speciality: $scope.selected.speciality,
                        //sub_speciality		:$scope.selected.sub_speciality,
                        keyword1: $scope.selected.keyword1,
                        research_interest: $scope.selected.research_interest,
                        reviewer: $scope.selected.reviewer,
                        area_of_interest_id: $scope.selected.area_of_interest_id,
                        pageName: "area_of_interest",
                        is_deleted: true
                            //userProfileInfoData:$scope.areaOfInterestData,

                    };

                    var res = $http.post('update-user-profile-data', dataObj);
                    res.success(function(data, status, headers, config) {
                        $scope.message = data;
                        if ($scope.message == true) {

                            notif({
                                type: "success",
                                msg: mesaages.area_inst_dtl_dlt_success,
                                multiline: true,
                                position: "center",
                                timeout: 6000
                            });
                            $scope.showorhideupdate = false;
                            $scope.showorhideadd = true;
                            $scope.showorhidecancelupdate = false;
                            $scope.genericMethod();
                            $scope.r_area = '';
                            $scope.speciality = '';
                            //	$scope.sub_speciality='';
                            $rootScope.keywords = '';
                            $scope.research_interest = "";
                            $scope.areaOfInterest.$setPristine();
                            //$scope.reviewer='';
                            $scope.areaOfInterestId = 0;
                            $scope.areaOfInterest.$setPristine(true);
                        } else {
                            notif({
                                type: "error",
                                msg: mesaages.area_inst_dtl_not_dlt_plz_cont_adm,
                                position: "center",
                                multiline: true,
                                timeout: 6000
                            });
                        }
                    });
                    res.error(function(data, status, headers, config) {
                        notif({
                            type: "error",
                            msg: mesaages.somth_wrog_plz_cont_adm,
                            multiline: true,
                            position: "center",
                            timeout: 6000
                        });
                    });
                }
            });
        }
    };
    $scope.saveUesrAreaOfInterest = function(form) {
        angular.forEach(form, function(obj) {
            if (angular.isObject(obj) && angular.isDefined(obj.$setDirty)) {
                obj.$setDirty();
            }
        })
        $scope.success = false;
        $scope.failure = false;
        $scope.error = false;
        $scope.invalid = false;
        $scope.isDisabled = true;
        if (form.$valid) {
            var dataObj = {
                research_area: $scope.r_area,
                speciality: $scope.speciality,
                //	sub_speciality		:$scope.sub_speciality,
                keyword1: $rootScope.keywords,
                research_interest: $scope.research_interest,
                reviewer: $scope.reviewer,
                area_of_interest_id: $scope.areaOfInterestId,
                pageName: "area_of_interest",
                is_deleted: false
                    //userProfileInfoData:$scope.areaOfInterestData,

            };
            var res = $http.post('update-user-profile-data', dataObj);
            res.success(function(data, status, headers, config) {
                $scope.message = data;

                if ($scope.message == true) {
                    notif({
                        type: "success",
                        msg: mesaages.area_intert_dtl_success_add,
                        multiline: true,
                        position: "center",
                        timeout: 6000
                    });
                    $scope.showorhideupdate = false;
                    $scope.showorhideadd = true;
                    $scope.showorhidecancelupdate = false;
                    $scope.genericMethod();
                    $scope.r_area = '';
                    $scope.speciality = '';
                    $rootScope.keywords = '';
                    $scope.research_interest = '';
                    $scope.areaOfInterestId = 0;
                    $scope.areaOfInterest.r_area.$setPristine(true);
                    $scope.areaOfInterest.speciality.$setPristine(true);
                    $scope.areaOfInterest.research_interest.$setPristine(true);
                    $scope.areaOfInterest.$setPristine(true);
                } else {
                    notif({
                        type: "error",
                        msg: mesaages.area_intr_dlt_not_add_pla_adm,
                        position: "center",
                        multiline: true,
                        timeout: 6000
                    });
                }
            });
            res.error(function(data, status, headers, config) {
                notif({
                    type: "error",
                    msg: mesaages.somth_wrog_plz_cont_adm1,
                    multiline: true,
                    position: "center",
                    timeout: 6000
                });
            });
        } else {
            notif({
                type: "warning",
                msg: mesaages.kindlyfilldata,
                multiline: true,
                position: "center",
                timeout: 6000
            });
            $scope.isDisabled = false;
        }
    }
    $scope.areaOfInterestCancel = function() {
        highlightTableRowService.removeHighlight();
        $scope.showorhideupdate = false;
        $scope.showorhideadd = true;
        $scope.showorhidecancelupdate = false;
        $scope.r_area = '';
        $scope.speciality = '';
        //$scope.sub_speciality='';
        $rootScope.keywords = '';
        $scope.research_interest = '';
        //$scope.reviewer='';
        $scope.areaOfInterestId = 0,
            $scope.areaOfInterest.r_area.$setPristine(true);
        $scope.areaOfInterest.speciality.$setPristine(true);
        //$scope.areaOfInterest.sub_speciality.$setPristine(true);
        $scope.areaOfInterest.keyword1.$setPristine(true);
        $scope.areaOfInterest.research_interest.$setPristine(true);
        $scope.areaOfInterest.reviewer.$setPristine(true);
    }
}]);
/*************Area of interest page ends here**********************/
controllerModuleAPP.service('cvUpload', ['$http', function($http) {
    this.uploadFileToUrl = function(file, uploadUrl, $scope) {
        var fd = new FormData();
        fd.append('file', file);

        var res = $http.post(uploadUrl, fd, {
                transformRequest: angular.identity,
                headers: {
                    'Content-Type': undefined
                }


            })
            //alert(res);
        res.success(function(data, status, headers, config) {
            message = data;
            if (message) {
                $scope.genericMethod();
                notif({
                    type: "success",
                    msg: mesaages.cv_upload_succes,
                    multiline: true,
                    position: "center",
                    timeout: 6000,
                    append: false
                });
                angular.element("input[type='file']").val(null);
                $scope.certificationFile = '';
                $scope.getCVDetails();
                $scope.completion_date = '';
                $scope.expriry_date = '';
                //$rootScope.success = true;
            } else {
                notif({
                    type: "warning",
                    msg: mesaages.file_upload_fail,
                    multiline: true,
                    position: "center",
                    timeout: 6000,
                    append: false
                });
            }
        });
        res.error(function(data, status, headers, config) {
            notif({
                type: "warning",
                msg: mesaages.Somth_error_serv_plz_cont_serv_adm,
                multiline: true,
                position: "center",
                timeout: 6000,
                append: false
            });
        });
    }
}]);
controllerModuleAPP.service('certificatUpload', ['$http','$timeout','$rootScope', function($http,$timeout,$rootScope) {
	
	var certificateObj = this;
	certificateObj.uploadUrl;
	certificateObj.uploadFile;
	certificateObj.failCount=0;
	certificateObj.appScope;
	certificateObj.setUploadUrl= function(uploadUrl){
		certificateObj.uploadUrl=uploadUrl;
	}
	certificateObj.setUploadFile= function(uploadFile){
		certificateObj.uploadFile=uploadFile;
	}
	certificateObj.setFailCount= function(failCount){
		certificateObj.failCount=failCount;
	}
	certificateObj.getUploadUrl = function(){
		return certificateObj.uploadUrl;
	}
	certificateObj.getUploadFile = function(){
		return certificateObj.uploadFile;
	}
	certificateObj.getFailCount = function(){
		return certificateObj.failCount;
	}
	certificateObj.setAppScope = function(appScope){
		return certificateObj.appScope=appScope;
	}
	certificateObj.getAppScope = function(){
		return certificateObj.appScope;
	}
	
    certificateObj.uploadFileToUrl = function(file, uploadUrl, $scope) {
    	
    	certificateObj.setUploadUrl(uploadUrl);
    	certificateObj.setUploadFile(file);
    	certificateObj.setAppScope($scope);
    	
        var fd = new FormData();
        fd.append('file', file);

        var res = $http.post(uploadUrl, fd, {
                transformRequest: angular.identity,
                headers: {
                    'Content-Type': undefined
                }


            })
            //alert(res);
        res.success(function(data, status, headers, config) {
            message = data;
             certificateObj.setFailCount(0);
            if (message) {
                notif({
                    type: "success",
                    msg: mesaages.cert_upload_success,
                    multiline: true,
                    position: "center",
                    timeout: 6000,
                    append: false
                });
                angular.element("input[type='file']").val(null);
                $scope.certificationFile = '';
                $scope.genericMethod();
                $scope.success = true;
                $("#uploadFormModal").modal('hide');
                $scope.getListOfDownloadForms();

            } else {
          $scope.deleteCertificateIfCertificateFailed($scope.isItNewCertificate,$scope.newCertificationId);
                 angular.element("input[type='file']").val(null);
                notif({
                    type: "warning",
                    msg: mesaages.cert_upload_fail,
                    multiline: true,
                    position: "center",
                    timeout: 6000,
                    append: false
                });
            }
        });
        res.error(function(data, status, headers, config) {
        	
        	 if(status!=null){
        		 var fileUploadAttemptCount = certificateObj.getFailCount();
        		 if(fileUploadAttemptCount>=5){
        			 certificateObj.setFailCount(0);
        			 var actAppScope = certificateObj.getAppScope();
        			 actAppScope.deleteCertificateIfCertificateFailed(actAppScope.isItNewCertificate,actAppScope.newCertificationId);
        			 notif({
   					  type: "error",
   					  msg: "Due To Network Issue, Please logout and login again Then Try Again." ,
   					  position: "center",
   					  multiline: true,
   					   timeout: 6000
   					});
        		 }else{
        		 	  $rootScope.$emit('loaderShow', "customLoader");
        			  $timeout(function() { 
        			  	  $rootScope.$emit('loaderHide', "customLoader");
        				 certificateObj.setFailCount(fileUploadAttemptCount+1);
            			 certificateObj.uploadFileToUrl(certificateObj.getUploadFile(), certificateObj.getUploadUrl(),certificateObj.getAppScope());
        	            }, 400); 
        		 }
        	 }else{
        	 	 notif({
                type: "warning",
                msg: mesaages.Somth_error_serv_plz_cont_serv_adm,
                multiline: true,
                position: "center",
                timeout: 6000,
                append: false
            });
        	}
        	
            
        });
    }
}]);

/************Certification page starts here*******************/
controllerModuleAPP.controller('certification-page-controller', ['$scope', 'userPersonalDetails', '$http', 'cvUpload', 'certificatUpload', 'fileUpload', '$compile', '$rootScope', 'componentService', 'dateConvert', 'highlightTableRowService', '$window','NewCodeSetServiceJS','documentValidation', function($scope, userPersonalDetails, $http, cvUpload, certificatUpload, fileUpload, $compile, $rootScope, componentService, dateConvert, highlightTableRowService, $window,NewCodeSetServiceJS,documentValidation) {
    var  URL = window.location.href;
    requestedUrl  =  URL.substring(URL.lastIndexOf('/')  +  1);
    URL = "/" + requestedUrl;
    componentService.getSessionDataInPage($scope, URL);
    $scope.$MyService = componentService;
    $scope.MyNewCodeSetServiceJS = NewCodeSetServiceJS;
    /*myData contains the values of form data*/
    $scope.success = false;
    $scope.failure = false;
    $scope.error = false;
    $scope.invalid = false;
    $scope.isDisabled = false;
    $scope.showorhideupdate = false;
    $scope.showorhideadd = true;
    $scope.showOtherProgNameDiv = false;
    $scope.showProgNameDiv=true;
    $scope.isDisableSelectedField = true;
    $scope.otherProgrammeName="";
    $scope.showorhidecancelupdate = false;
    $('#showexpirynahide').hide();
    $scope.hideCertificateFileNameLabel = true;
    $scope.isDisableWhenCertificateEditMode =  false;
    $scope.statusvalue = true;
    $scope.certification_id = 0;
    var dataObjForCourse = {

        codeSet: 'COURSE'
    };
    $scope.getCVDetails = function() {
        var cvData = $http.get('get-user-cv', dataObjForCourse);

        cvData.success(function(data, status, headers, config) {
            $("#cvdiv").empty();
            for (var key in data) {
                $scope.realName = data[0].realName;
                $scope.displayName = data[0].displayName;
                var dcEl = angular.element(document.querySelector('#cvdiv'));

                var dchtmlelement = "<a href='download1/" + $scope.displayName + "/data'>" + $scope.realName + "</a></span>"; //download/${fileName}/data }


                dcEl.append(dchtmlelement);
                //compiling the newly created div for angular
                $compile(dcEl)($scope);
            }
        });
    }
    $scope.convertTodayDate = function(inputFormat) {
        function pad(s) {
            return (s < 10) ? '0' + s : s;
        }
        var d = new Date(inputFormat);
        return [pad(d.getDate()), pad(d.getMonth() + 1), d.getFullYear()].join('/');
    }
    var date = new Date();

    $scope.status_date = $scope.convertTodayDate(date);
    $scope.orgstatus = true;



    //stage
    $scope.seq = ["1", "2", "3", "4", "5", "6", "7", "8", "9", "10"];
    $scope.certificate_stage = ''; //$scope.seq[0];
    //status 

    //$scope.status_names = ["Started","Completed","Requested","Expired","Failed Course"];        
    // $scope.status=$scope.status_names[0];

    $scope.statusCodeset = [];
    var statusCodesets1=["ST_START","ST_COMP","ST_REQT","ST_EXPD","ST_FAID"];
    var statusCodest = $http.post('get-all-codeSets-for-certification-status',statusCodesets1);
    statusCodest.success(function(data, status, headers, config) {
        // $scope.status_names=data.shortDesc; 
        $scope.codeSets = data;
        $scope.status_names = data;
        angular.forEach($scope.codeSets, function(value, i) {
            if (value.codeSet == 'ST_START') {
                $scope.statusData = value.codeSet;
                $scope.statusDatatitle=value.shortDesc;
                $scope.status = value.codeSet;
            }
        })
    });
    statusCodest.error(function(data, status, headers, config) {
        $scope.error = true;
    });


    // $scope.status=$scope.status[0];
    $scope.codesetFormainOrRefresher = ["Main", "Refresher"];
    $scope.mainOrRefresher = undefined; //$scope.codesetFormainOrRefresher[0];
    //get List of Organizations
    var orgTypeData = {
        orgType: "ORGN_TYPE_101"
    };

    var orgDataList = $http.post('getListofOrganizationNames', orgTypeData);
    orgDataList.success(function(data, status, headers, config) {
        $scope.organizationsList = [];
        $scope.organizationsList = data;
        if ($scope.organizationsList.length > 0) {
            $scope.otherObject = {};
            $scope.otherObject.orgName = "Other";
            $scope.otherObject.codeSet = "OTHER";
            $scope.otherObject.shortDesc = "Other";
            $scope.organizationsList.push($scope.otherObject);
        }
    })
    orgDataList.error(function(data, status, headers, config) {
        $scope.error = true;
    });



    $scope.organization_name = {
        selectedOrgs: []
    };

    $scope.organization_names_temp = [];
    $scope.jsonFacilityConversionOrg = function(val, key) {
        var tempstring = "codeSet";
        var tempCodeSetVal = "orgName";
        $scope.organization_names_temp = {};
        $scope.organization_names_temp[tempstring] = key;
        $scope.organization_names_temp[tempCodeSetVal] = val;
        return $scope.organization_names_temp;
    };
    $scope.course_name_selected = {
        selectCourse: []
    };
    $scope.jsonFacilityConversion = function(val, key) {
        var tempstring = "courseId";
        var tempCodeSetVal = "courseName";
        $scope.organization_names_temp = {};
        $scope.organization_names_temp[tempstring] = key;
        $scope.organization_names_temp[tempCodeSetVal] = val;
        return $scope.organization_names_temp;
    };
    $scope.getCVDetails();
    /*$scope.downloadCv=function(){
    	var cvData={
    			file_name:$scope.displayName,
    			directory:"CV"
    			
    	}
    	var scDownload = $http.post('download-files', cvData);
    }*/
    //list of Coutrses
    var dataObjForCourse = {
        orgType: "ORGN_TYPE_101"
    };
    var resCourseList = $http.post('getListofCityCoursesNames');
    resCourseList.success(function(data, status, headers, config) {
        $scope.CodeSetsForCourse = data;

    });
    resCourseList.error(function(data, status, headers, config) {
        notif({
            type: "error",
            msg: mesaages.error,
            multiline: true,
            position: "center",
            timeout: 6000
        });

    });
    //main or refresher
    $scope.getCourseDetailsByCourseId = function() {

        var courseId = {
            course_id: $scope.course_name_selected.selectCourse.courseId,
        };

        var orgDataList = $http.post('get-course-details-by-course-id', courseId);
        orgDataList.success(function(data, status, headers, config) {
            $scope.courseCodeSet = data;
            if ($scope.status == "ST_REQT") {

                $scope.getMainOrRefresher(data.onceOrRepeat, data.minpass, data.repeatDuration);
                $scope.getExpirtDateForrequested(data.repeatDuration);
            } else if ($scope.status != "ST_REQT") {
                $scope.getMainOrRefresher(data.onceOrRepeat, data.minpass, data.repeatDuration);
                $scope.getExpirtDateForrequested(data.repeatDuration);
            }
        })
        orgDataList.error(function(data, status, headers, config) {
            $scope.error = true;
        });

    }
    $scope.getExpirtDateForrequested = function(repeatDuration) {

        $scope.repeatDuration = repeatDuration;
    }
    $scope.getMainOrRefresher = function(onceorrepeat, minpas, repeatDuration) {
    	$scope.minPas = minpas;
        $scope.repeatDuration = repeatDuration;

        if ($scope.certificationDataUserName != null || $scope.certificationDataUserName != undefined || $scope.certificationDataUserName != "") {
            $scope.user_name = $scope.certificationDataUserName;
        }
        if ($scope.certificationDataMemberId != null || $scope.certificationDataMemberId != undefined || $scope.certificationDataMemberId != "") {
            $scope.member_id = $scope.certificationDataMemberId;
        }

        var onceorrepeat = onceorrepeat;
        var courseExist=false;
        if (onceorrepeat != null || onceorrepeat != undefined || onceorrepeat != "") {
        	
        	if($scope.certificationData!=undefined){
        	$.each($scope.certificationData,function(key,value){
        	if($scope.organization_name.selectedOrgs.codeSet==value.orgnId && $scope.course_name_selected.selectCourse.courseId==value.courseId && 
        			value.status=="ST_COMP"){
        	courseExist=true;
        	return false;
        	}
        	});
        	}
        	if(courseExist==true){
        	 $scope.mainOrRefresher = $scope.codesetFormainOrRefresher[1];
                 $scope.statusvalue = false;
                 $scope.expirydatastatus = false;
                 // $scope.certificate_stage=$scope.seq[0];
                 var curDate = $scope.course_completion_date;
                 if (curDate != null && curDate != undefined && curDate != "") {
                     var arr = curDate.split("/");
                     $scope.expriry_date = parseInt(arr[0])-1 + "/" + arr[1] + "/" + (parseInt(arr[2]) + parseInt(repeatDuration));
                 } else {
                     $scope.expriry_date = '';
                 }
                 if ($scope.course_completion_date == undefined || $scope.course_completion_date == "" || $scope.course_completion_date == null) {
                     $scope.expriry_date = '';
                 }
                 $('#showexpirynahide').hide();
        	}else{

                $scope.mainOrRefresher = $scope.codesetFormainOrRefresher[0];
                $scope.certificate_stage = $scope.seq[0];
                $scope.expriry_date = '';
                $('#showexpirynahide').show();
                $scope.expirydatastatus = true;
                $scope.statusvalue = true;
                
        /*	if (onceorrepeat == "R") {
                    $scope.mainOrRefresher = $scope.codesetFormainOrRefresher[0];
                    $scope.statusvalue = false;
                    $scope.expirydatastatus = false;
                    // $scope.certificate_stage=$scope.seq[0];
                    var curDate = $scope.course_completion_date;
                    if (curDate != null && curDate != undefined && curDate != "") {
                        var arr = curDate.split("/");
                        $scope.expriry_date = arr[0] + "/" + arr[1] + "/" + (parseInt(arr[2]) + parseInt(repeatDuration));
                    } else {
                        $scope.expriry_date = '';
                    }
                    if ($scope.course_completion_date == undefined || $scope.course_completion_date == "" || $scope.course_completion_date == null) {
                        $scope.expriry_date = '';
                    }
                    $('#showexpirynahide').hide();
                     var date=new Date();
                     if(dateConvert.convertDateToMiliSecondForProfile($scope.convertTodayDate(date))>dateConvert.convertDateToMiliSecondForProfile($scope.expriry_date))
                    	 {
                    	 alert("expired");
                    	 }
                } else if (onceorrepeat == "O") {
                    $scope.mainOrRefresher = $scope.codesetFormainOrRefresher[0];
                    $scope.certificate_stage = $scope.seq[0];
                    $scope.expriry_date = '';
                    $('#showexpirynahide').show();
                    $scope.expirydatastatus = true;
                    $scope.statusvalue = true;
                }*/
        	}
            
            $scope.changeExpiryDate();
        }

    }
    if ($scope.repeatDuration == undefined || $scope.repeatDuration == "" || $scope.repeatDuration == null) {
        $scope.expriry_date = '';
    }
    $scope.disableUploadFileDiv=false;
    $scope.changeExpiryDate = function() {
    	if($scope.organization_name.selectedOrgs.codeSet == "OTHER"){
    		if($scope.course_completion_date!=null || $scope.course_completion_date!=undefined){
    			$scope.status = "ST_COMP";
    		}else{
    			 $scope.status="ST_START";
    		}
    	}else{
    		if($scope.certification_id == 0){
    			if ($scope.repeatDuration == undefined || $scope.repeatDuration == "" || $scope.repeatDuration == null) {
    	            $scope.expriry_date = '';
    	        } else if ($scope.course_completion_date == undefined || $scope.course_completion_date == "" || $scope.course_completion_date == null) {
    	            $scope.expriry_date = '';
    	            $('#showexpirynahide').hide();
    	        } else {
    	            var curDate = $scope.course_completion_date;
    	            var arr = curDate.split("/");
    	            $scope.expriry_date = parseInt(arr[0])-1 + "/" + arr[1] + "/" + (parseInt(arr[2]) + parseInt($scope.repeatDuration));
    	        }
    	        var todayDate = dateConvert.checkForTodayDate();
    	        if (dateConvert.convertDateToMiliSecondForProfile($scope.expriry_date) < dateConvert.convertDateToMiliSecondForProfile(todayDate)) {
    	            angular.forEach($scope.codeSets, function(value, i) {
    	                    if (value.codeSet == 'ST_EXPD') {
    	                        $scope.statusData = value.codeSet;
    	                        $scope.status = value.codeSet;
    	                    }
    	                })
    	                // $scope.status=$scope.status_names[3];   
    	        } else {

    	            if ($scope.minPas != null || $scope.minPas != undefined || $scope.minPas != "") {
    	                if (parseInt($scope.score) >= parseInt($scope.minPas)) {
    	                    angular.forEach($scope.codeSets, function(value, i) {
    	                            if (value.codeSet == 'ST_COMP') {
    	                                $scope.statusData = value.codeSet;
    	                                $scope.status = value.codeSet;
    	                            }
    	                        })
    	                        //$scope.status=$scope.status_names[1];

    	                } else if (parseInt($scope.score) < parseInt($scope.minPas)) {
    	                    angular.forEach($scope.codeSets, function(value, i) {
    	                            if (value.codeSet == 'ST_FAID') {
    	                                $scope.statusData = value.codeSet;
    	                                $scope.status = value.codeSet;
    	                            }
    	                        })
    	                        //$scope.status=$scope.status_names[4];

    	                }
    	            }
    	            if ($scope.score == null || $scope.score == undefined || $scope.score == "") {
    	                angular.forEach($scope.codeSets, function(value, i) {
    	                        if (value.codeSet == 'ST_START') {
    	                            $scope.statusData = value.codeSet;
    	                            $scope.status = value.codeSet;
    	                        }
    	                    })
    	                    //$scope.status=$scope.status_names[0];
    	            }
    	            // $scope.status=$scope.status_names[1];
    	        }
    	        if (dateConvert.convertDateToMiliSecondForProfile($scope.course_completion_date) > dateConvert.convertDateToMiliSecondForProfile(todayDate)) {
    	            notif({
    	                type: "error",
    	                msg: mesaages.compl_data_not_grt_than_curr_dat,
    	                position: "center",
    	                multiline: true,
    	                timeout: 6000
    	            });
    	        }
    			
    		}else if ($scope.certification_id > 0){
    			if ($scope.repeatDuration == undefined || $scope.repeatDuration == "" || $scope.repeatDuration == null) {
    	            $scope.expriry_date = '';
    	        } else if ($scope.course_completion_date == undefined || $scope.course_completion_date == "" || $scope.course_completion_date == null) {
    	            $scope.expriry_date = '';
    	            $('#showexpirynahide').hide();
    	        } else {
    	            var curDate = $scope.course_completion_date;
    	            var arr = curDate.split("/");
    	            $scope.expriry_date = parseInt(arr[0])-1 + "/" + arr[1] + "/" + (parseInt(arr[2]) + parseInt($scope.repeatDuration));
    	        }
    	        var todayDate = dateConvert.checkForTodayDate();
    	        if (dateConvert.convertDateToMiliSecondForProfile($scope.expriry_date) < dateConvert.convertDateToMiliSecondForProfile(todayDate)) {
    	            angular.forEach($scope.codeSets, function(value, i) {
    	                    if (value.codeSet == 'ST_EXPD') {
    	                        $scope.statusData = value.codeSet;
    	                        $scope.status = value.codeSet;
    	                    }
    	                })
    	                // $scope.status=$scope.status_names[3];   
    	        } else {

    	            if ($scope.minPas != null || $scope.minPas != undefined || $scope.minPas != "") {
    	                if (parseInt($scope.score) >= parseInt($scope.minPas)) {
    	                    angular.forEach($scope.codeSets, function(value, i) {
    	                            if (value.codeSet == 'ST_COMP') {
    	                                $scope.statusData = value.codeSet;
    	                                $scope.status = value.codeSet;
    	                            }
    	                        })
    	                        //$scope.status=$scope.status_names[1];

    	                } else if (parseInt($scope.score) < parseInt($scope.minPas)) {
    	                    angular.forEach($scope.codeSets, function(value, i) {
    	                            if (value.codeSet == 'ST_FAID') {
    	                                $scope.statusData = value.codeSet;
    	                                $scope.status = value.codeSet;
    	                            }
    	                        })

    	                }
    	            }
    	        }
    	        if (dateConvert.convertDateToMiliSecondForProfile($scope.course_completion_date) > dateConvert.convertDateToMiliSecondForProfile(todayDate)) {
    	            notif({
    	                type: "error",
    	                msg: mesaages.compl_data_not_grt_than_curr_dat,
    	                position: "center",
    	                multiline: true,
    	                timeout: 6000
    	            });
    	        }
    		}
    		 
    	}
    	var todayDate = dateConvert.checkForTodayDate();
        if (dateConvert.convertDateToMiliSecondForProfile($scope.expriry_date) < dateConvert.convertDateToMiliSecondForProfile(todayDate)) {
        	$scope.disableUploadFileDiv=true;
        }else{
        	$scope.disableUploadFileDiv=false;
        }

    }
    $scope.getOtherOrganization = function(other, org, codeSet) {


        if ((other != null || other != undefined || other != "")) {
            if (other = "Other") {
                $scope.orgstatus = false;

            } else if (org != "Other") {
                $scope.orgstatus = true;
            }
        } else {
            $scope.orgstatus = true;
        }

        if (org != "Other") {
            $scope.orgstatus = true;
        }

        if (codeSet == "OTHER") {
            $scope.showOtherProgNameDiv = true;
            $scope.isDisableSelectedField = false;
            $scope.statusvalue = false;
            $scope.showProgNameDiv=false;
            $scope.status="ST_START";
        } else {
            $scope.showOtherProgNameDiv = false;
            $scope.isDisableSelectedField = true;
            $scope.statusvalue = true;
        }

    }
    $scope.getStatusChange = function(minpas) {
    	if($scope.organization_name.selectedOrgs.codeSet == "OTHER"){
    		
    	}else{
    		$scope.rep_score = $scope.score;
            if ($scope.minPas != null || $scope.minPas != undefined || $scope.minPas != "") {
                if (parseInt($scope.rep_score) >= parseInt($scope.minPas)) {
                    angular.forEach($scope.codeSets, function(value, i) {
                            if (value.codeSet == 'ST_COMP') {
                                $scope.statusData = value.codeSet;
                                $scope.status = value.codeSet;
                            }

                        })
                        //$scope.status=$scope.status_names[1];

                } else if (parseInt($scope.rep_score) < parseInt($scope.minPas)) {
                    angular.forEach($scope.codeSets, function(value, i) {
                            if (value.codeSet == 'ST_FAID') {
                                $scope.statusData = value.codeSet;
                                $scope.status = value.codeSet;
                            }

                        })
                        //$scope.status=$scope.status_names[4];

                }
            }
            if ($scope.score == null || $scope.score == undefined || $scope.score == "") {
                angular.forEach($scope.codeSets, function(value, i) {
                        if (value.codeSet == 'ST_START') {
                            $scope.statusData = value.codeSet;
                            $scope.status = value.codeSet;
                        }
                    })
                    // $scope.status=$scope.status_names[0];

            }
            var todayDate = dateConvert.checkForTodayDate();
            if (dateConvert.convertDateToMiliSecondForProfile($scope.expriry_date) < dateConvert.convertDateToMiliSecondForProfile(todayDate)) {
                angular.forEach($scope.codeSets, function(value, i) {
                        if (value.codeSet == 'ST_EXPD') {
                            $scope.statusData = value.codeSet;
                            $scope.status = value.codeSet;
                        }
                    })
                    //$scope.status=$scope.status_names[3];

            }
    	}
    }

    var dataObjForCompletedModule = {
        codeSet: 'COMPLETED_MODULE'
    };
   /* var res = $http.post('getCodeSetByCodeSetType', dataObjForCompletedModule);
    res.success(function(data, status, headers, config) {
        $scope.CodeSetsCompletedModule = data.codeSetsEntity;

    });
    res.error(function(data, status, headers, config) {
        notif({
            type: "error",
            msg: mesaages.error,
            multiline: true,
            position: "center",
            timeout: 6000
        });
    });*/
     NewCodeSetServiceJS.getAllCodeSetsByType(dataObjForCompletedModule)
    .then(function (data) {
     $scope.CodeSetsCompletedModule = data.codeSetsEntity;
     },
    function (errorMessage) {
     });
     
    $('pages').de

    $scope.genericMethod = function() {
        $http({
                method: 'GET',
                url: 'get-certification-page-data'
            })
            .success(function(data, status, headers, config) {
                $scope.certificationData = data.certificationDetails.certificationInformation;
                if (data.certificationDetails.certificationInformation.length > 0) {
                    $scope.certificationDataMemberId = data.certificationDetails.certificationInformation[0].memberId;
                    $scope.certificationDataUserName = data.certificationDetails.certificationInformation[0].userName;
                }


                $('#certifications').bootstrapTable({
                    data: $scope.certificationData
                });

                $('#certifications').bootstrapTable('load', $scope.certificationData);
                $scope.addBubbleDataForCertification($scope.certificationData);
            })
            .error(function(data, status, headers, config) {

            });
    }
    $scope.genericMethod();
    $scope.colors = [
        "col-lg-2 col-md-2 col-sm-2 bubble-box bg-aqua",
        "col-lg-2 col-md-2 col-sm-2 bubble-box bg-green",
        "col-lg-2 col-md-2 col-sm-2 bubble-box bg-yellow",
        "col-lg-2 col-md-2 col-sm-2 bubble-box bg-red",
        "col-lg-2 col-md-2 col-sm-2 bubble-box bg-aqua",
        "col-lg-2 col-md-2 col-sm-2 bubble-box bg-green",
        "col-lg-2 col-md-2 col-sm-2 bubble-box bg-yellow",
        "col-lg-2 col-md-2 col-sm-2 bubble-box bg-red",
        "col-lg-2 col-md-2 col-sm-2 bubble-box bg-aqua",
        "col-lg-2 col-md-2 col-sm-2 bubble-box bg-green",
        "col-lg-2 col-md-2 col-sm-2 bubble-box bg-yellow",
        "col-lg-2 col-md-2 col-sm-2 bubble-box bg-red",
        "col-lg-2 col-md-2 col-sm-2 bubble-box bg-aqua",
        "col-lg-2 col-md-2 col-sm-2 bubble-box bg-green",
        "col-lg-2 col-md-2 col-sm-2 bubble-box bg-yellow",
        "col-lg-2 col-md-2 col-sm-2 bubble-box bg-red",
        "col-lg-2 col-md-2 col-sm-2 bubble-box bg-aqua",
        "col-lg-2 col-md-2 col-sm-2 bubble-box bg-green",
        "col-lg-2 col-md-2 col-sm-2 bubble-box bg-yellow",
        "col-lg-2 col-md-2 col-sm-2 bubble-box bg-red"
    ];
    $scope.addBubbleDataForCertification = function(data) {
        $("#CertificationBubble").empty();
        var j = 0;
        for (i in data) {
            j++;
            console.log(data);
            $scope.dummyData = [{
                status: "",
                organization: "",
                course: "",
                expiry_date: ""
            }];
            //$scope.modelDataCertification=data[i];
            $scope.modelDataCertification = data[i];
            var tempValueCertification = "tempValueCertification" + i;
            $scope.tempCertification = "tempValueCertification" + i
            $scope[tempValueCertification] = data[i];
            if ($scope.modelDataCertification.expriry_date == undefined || $scope.modelDataCertification.expriry_date == '' || $scope.modelDataCertification.expriry_date == null) {
                $scope.expiry_date1 = '';
            } else {
                $scope.expiry_date1 = $scope.modelDataCertification.expriry_date;

            }
            var inputbox = "<div class='col-lg-6 col-md-6 bubblesboxw'> <div class='info-box'> <span class='info-box-icon bg-aqua'><p class='fa fa-fw fa-sun-o iconcenter'></p><p class='iconcentertextnum'>" + (j) + "</p></span> <div class='info-box-content'> <strong><span class='info-box-text'>" + $scope.modelDataCertification.course + "</span></strong>  <span class='info-box-text'>" + $scope.modelDataCertification.status_name + "</span> <span class='info-box-text'>" + $scope.modelDataCertification.organization_name + "</span><span class='info-box-text'>" + $scope.expiry_date1 + "</span></div><a ng-click='fillDataIntoFormCertification(" + $scope.tempCertification + ")' class='small-box-footer moreinfomit' title='More Info'><i class='fa fa-arrow-circle-right'></i></a></div> </div>";
            $("#CertificationBubble").append(inputbox);

        }
        $compile($('#CertificationBubble'))($scope);

    }

    $scope.fillDataIntoFormCertification = function(row) {
            $.confirm({
                title: mesaages.areusure,
                content_box: mesaages.editmsg,
                confirm: function() {
                	$scope.ExistingCertificateDetails =row;
                    $scope.showorhideupdate = true;
                    $scope.showorhideadd = false;
                    $scope.showorhidecancelupdate = true;
                    $scope.statusvalue = false;
                    $scope.hideCertificateFileNameLabel = false;
                    $scope.isDisableWhenCertificateEditMode =  true;
                    $scope.selected = row;
                    $scope.mainOrRefresher = $scope.selected.mainOrRefresher;
                    $scope.existingCertificateFile = $scope.selected.certificate_file_name_without_url;
                    $scope.status="";
                    $scope.existingCertificateStatus=$scope.selected.status;
                    //$scope.status = $scope.selected.status;
                    if($scope.selected.status=='ST_REQT')
                    {
                    	$scope.status='ST_START';
                    }
                    else{
                    	$scope.status = $scope.selected.status;
                    }
                    $scope.course_completion_date = $scope.selected.course_completion_date;
                    $scope.status.selected = $scope.selected.status;
                    $.each($scope.codeSets, function(key, value) {
                        if ($scope.selected.status == value.codeSet)
                            $scope.tooltip = value.shortDesc;
                    });
                    $scope.score = $scope.selected.reported_score;
                    $scope.completed_score = $scope.selected.completion_report;
                    $scope.course = $scope.selected.course;
                    $scope.completed_module = $scope.selected.completed_module;
                    $scope.score = $scope.selected.reported_score;
                    $scope.status_date = $scope.selected.status_date;
                    $scope.course_completion_date = $scope.selected.course_completion_date;
                    $scope.expriry_date = $scope.selected.expriry_date;
                    $scope.file_name = $scope.selected.certificationFile;
                    $scope.certification_id = $scope.selected.certification_id;
                    $scope.certificate_stage = $scope.selected.stage.toString();
                    $scope.member_id = $scope.selected.memberId;
                    $scope.user_name = $scope.selected.userName;
                    if($scope.selected.orgnId=="OTHER"){
                    	$scope.otherObject = {};
                        $scope.otherObject.orgName = "Other";
                        $scope.otherObject.codeSet = $scope.selected.orgnId;
                        $scope.otherObject.shortDesc = "Other";
                        $scope.organization_name.selectedOrgs=$scope.otherObject;
                        $scope.otherProgrammeName=$scope.selected.other_organization_name;
                        $scope.otherCourseName=$scope.selected.courseId;
                        $scope.getOtherOrganization($scope.selected.orgnId,"Other",$scope.selected.orgnId);
                        $scope.changeExpiryDate();
                    }else{
                    	$scope.course_name_selected.selectCourse = $scope.jsonFacilityConversion($scope.selected.course, $scope.selected.courseId);
                        $scope.organization_name.selectedOrgs = $scope.jsonFacilityConversionOrg($scope.selected.organization_name, $scope.selected.orgnId);
                        $scope.getCourseDetailsByCourseId();
                    }
                    $scope.$apply();
                    $(".back-to-top").trigger("click");

                }
            });
        }
        //	$scope.genericMethod();
        /**
         * file upload code
         */
    $scope.uploadFile = function() {
        var file = $scope.myFile;

        console.log('file is ');
        console.dir(file);

        var uploadUrl = "upload-cv";
        if (file != undefined && file != "" && file != "No file") {
            var type = file.type;
            var size = file.size + "";
            var testsize = mesaages.maxsize;
            $scope.isSpecialChar= documentValidation.checkForSpecialChar(file);
            if($scope.isSpecialChar==false){
          		 notif({
   					type : "warning",
   					msg : messageDefault.fileSpecChar,
   					position : "center",
   					multiline: true,
   					timeout : 6000,
   					autohide: true
   				});
   			 return false;
               }
            $scope.isDocName= documentValidation.checkForDocumentNameLenght(file);
            if($scope.isDocName==false){
            	notif({
					type : "warning",
					msg : messageDefault.fileLength,
					position : "center",
					multiline: true,
					timeout : 6000,
					autohide: true
				});
   			 return false;
               }
            if (type == "application/vnd.openxmlformats-officedocument.wordprocessingml.document" || type == "application/msword" || type == "application/pdf") {
                if (size < testsize) {
                    cvUpload.uploadFileToUrl(file, uploadUrl, $scope);
                } else {
                    notif({
                        type: "warning",
                        msg: mesaages.plz_slt_doc_size,
                        multiline: true,
                        position: "center",
                        timeout: 6000
                    });

                    return false;
                }
            } else {
                notif({
                    type: "warning",
                    msg: mesaages.plz_slt_doc_file,
                    multiline: true,
                    position: "center",
                    timeout: 6000
                });

                return false;
            }

        } else {
            notif({
                type: "error",
                msg: mesaages.plz_slt_file,
                multiline: true,
                position: "center",
                timeout: 6000
            });

            return false;
        }

    };
    $scope.stringToDate = function(_date, _format, _delimiter) {
        var formatLowerCase = _format.toLowerCase();
        var formatItems = formatLowerCase.split(_delimiter);
        var dateItems = _date.split(_delimiter);
        var monthIndex = formatItems.indexOf("mm");
        var dayIndex = formatItems.indexOf("dd");
        var yearIndex = formatItems.indexOf("yyyy");
        var month = parseInt(dateItems[monthIndex]);
        month -= 1;
        var formatedDate = new Date(dateItems[yearIndex], month, dateItems[dayIndex]);
        return formatedDate;
    }

    window.actionEvents = {
        'click .edit': function(e, value, row, index) {
            $.confirm({
                title: mesaages.areusure,
                content_box: mesaages.editmsg,
                confirm: function() {

                    highlightTableRowService.highlightcolor(e);
                    $scope.showorhideupdate = true;
                    $scope.showorhideadd = false;
                    $scope.showorhidecancelupdate = true;
                    $scope.hideCertificateFileNameLabel = false;
                    $scope.orgstatus = true;
                    $scope.selected = row;
                    $scope.indexvalue = index;
                    $scope.isDisableWhenCertificateEditMode =  true;
                    $scope.certificate_stage = $scope.selected.stage.toString();
                    $scope.mainOrRefresher = $scope.selected.mainOrRefresher;
                  //  $scope.status = $scope.selected.status;
                    if($scope.selected.status=='ST_REQT')
                    {
                    	$scope.status='ST_START';
                    }
                    else{
                    	$scope.status = $scope.selected.status;
                    }
                    
                    $scope.existingCertificateFile = $scope.selected.certificate_file_name_without_url;
                    $scope.course_completion_date = $scope.selected.course_completion_date;
                    $scope.status.selected = $scope.selected.status;
                    $.each($scope.codeSets, function(key, value) {
                        if ($scope.selected.status == value.codeSet)
                            $scope.tooltip = value.shortDesc;
                    });

                    $scope.score = $scope.selected.reported_score;
                    $scope.completed_score = $scope.selected.completion_report;
                    $scope.course = $scope.selected.course;
                    $scope.completed_module = $scope.selected.completed_module;
                    $scope.score = $scope.selected.reported_score;
                    $scope.status_date = $scope.selected.status_date;
                    $scope.expriry_date = $scope.selected.expriry_date;
                    $scope.file_name = $scope.selected.certificationFile;
                    $scope.certification_id = $scope.selected.certification_id;
                    $scope.member_id = $scope.selected.memberId;
                    $scope.certificate_stage = $scope.selected.stage;
                    $scope.user_name = $scope.selected.userName;
                    if($scope.selected.orgnId=="OTHER"){
                    	$scope.otherObject = {};
                        $scope.otherObject.orgName = "Other";
                        $scope.otherObject.codeSet = $scope.selected.orgnId;
                        $scope.otherObject.shortDesc = "Other";
                        $scope.organization_name.selectedOrgs=$scope.otherObject;
                        $scope.otherProgrammeName=$scope.selected.other_organization_name;
                        $scope.otherCourseName=$scope.selected.courseId;
                        $scope.getOtherOrganization($scope.selected.orgnId,"Other",$scope.selected.orgnId);
                        $scope.changeExpiryDate();
                    }else{
                    	$scope.course_name_selected.selectCourse = $scope.jsonFacilityConversion($scope.selected.course, $scope.selected.courseId);
                        $scope.organization_name.selectedOrgs = $scope.jsonFacilityConversionOrg($scope.selected.organization_name, $scope.selected.orgnId);
                        $scope.getCourseDetailsByCourseId();
                    }
                    $scope.$apply();
                    $(".back-to-top").trigger("click");

                }
            });
        },
        'click .remove': function(e, value, row, index) {
            $.confirm({
                title: mesaages.areusure,
                content_box: mesaages.deletemsg,
                confirm: function() {
                    $scope.selected = row;
                    var expriry_date = dateConvert.convertDateToMiliSecondForProfile($scope.expriry_date);
                    var completion_date = dateConvert.convertDateToMiliSecondForProfile($scope.course_completion_date);
                    var status_date = dateConvert.convertDateToMiliSecondForProfile($scope.status_date);
                    if ($scope.organization_name.selectedOrgs.orgName == "Other") {
                        var orgn_name = $scope.organization_new_name;
                    } else {
                        var orgn_name = $scope.organization_name.selectedOrgs.orgName;
                    }

                    var dataObj = {
                        certificationid: $scope.selected.certification_id,
                    };
                    $scope.certificationCancel();
                    $scope.organization_name.selectedOrgs = '';
                    $scope.organization_new_name = '';
                    $scope.course_name_selected.selectCourse = '';
                    $scope.certificate_stage = '';
                    $scope.mainOrRefresher = '';
                    $scope.course_completion_date = '';
                    $scope.completed_score = '';
                    $scope.score = '';
                    $scope.expriry_date = '';
                    $scope.member_id = '';
                    $scope.user_name = '';
                    $scope.file_name = '';

                    var res = $http.post('delete-user-citi-certification-data', dataObj);
                    res.success(function(data, status, headers, config) {
                        $scope.message = data;
                        if($scope.message==4){
		                        notif({
		                            type: "success",
		                            msg: mesaages.cert_dtl_dlt_success,
		                            multiline: true,
		                            position: "center",
		                            timeout: 6000
		                        });
			                        $scope.genericMethod();
			                        $scope.course = '';
			                        $scope.completed_module = '';
			                        $scope.score = '';
			                        $scope.completion_date = '';
			                        $scope.expriry_date = '';
			                        $scope.file_name = '';
			                        $scope.certification_id = 0,
			                            $scope.certification.$setPristine(true);
			                        $scope.showorhideupdate = false;
			                        $scope.showorhideadd = true;
			                        $scope.showorhidecancelupdate = true;
                        }else if($scope.message==5){
                        	 notif({
		                            type: "error",
		                            msg: "You can't delete as this requested from one of the study",
		                            multiline: true,
		                            position: "center",
		                            timeout: 6000
		                        });
                    	}else{
                        	 notif({
                        		  type: "error",
                        		  msg: mesaages.cert_not_dtl_plz_cont_adm,
                        		  position: "center",
                        		  multiline:true,
                        		  timeout: 6000
                        		});
                        }
                    });
                    res.error(function(data, status, headers, config) {
                        notif({
                            type: "error",
                            msg: mesaages.somth_wont_plz_cont_adm,
                            multiline: true,
                            position: "center",
                            timeout: 6000
                        });
                    });
                }
            });
        }
    };
    $scope.course_name_selected.selectCourse = "";
    $scope.organization_name.selectedOrgs = "";

    $scope.saveUesrCertification = function(form) {

        angular.forEach(form, function(obj) {
            if (angular.isObject(obj) && angular.isDefined(obj.$setDirty)) {
                obj.$setDirty();
            }
        })

        var file = $scope.certificationFile;
        /*  if(file==undefined || file=="" || file=="No file")
    	  {
     	  notif({
			  type: "warning",
			  msg: mesaages.cv_upload_needed,
			  multiline:true,
			  position: "center",
			   timeout: 6000
			});
		  return false; 
    	  } */

        /*if ($scope.completed_score == undefined || $scope.completed_score.match(/^\s*$/)
				|| $scope.completed_score == null || $scope.completed_score == "") {
			notif({
				type : "warning",
				msg : "Please fill valid Completion Report Number",
				position : "center",
				multiline : true,
				timeout : 6000
			});
			return false;
		}
		
		if ($scope.score == undefined || $scope.score.match(/^\s*$/)
				|| $scope.score == null || $scope.score == "") {
			notif({
				type : "warning",
				msg : "Please fill valid Reported Score",
				position : "center",
				multiline : true,
				timeout : 6000
			});
			return false;
		}*/

        var status_date = dateConvert.convertDateToMiliSecondForProfile($scope.status_date);

        var todayDate = dateConvert.checkForTodayDate();
        angular.forEach(form, function(obj) {
            if (angular.isObject(obj) && angular.isDefined(obj.$setDirty)) {
                obj.$setDirty();
            }
        })

        if(form.$valid){
        	

        if (dateConvert.convertDateToMiliSecondForProfile($scope.course_completion_date) > dateConvert.convertDateToMiliSecondForProfile(todayDate)) {
            notif({
                type: "error",
                msg: mesaages.compl_data_not_grt_than_curr_dat,
                position: "center",
                multiline: true,
                timeout: 6000
            });
            return false;

        }

        if($scope.status == "ST_EXPD" && $scope.existingCertificateStatus == "ST_REQT"){
        	  notif({
                  type: "error",
                  msg: "CITI Certification Expired. Complete CITI Certification and try again",
                  multiline: true,
                  position: "center",
                  timeout: 6000
              });
              return false;
        }
        
        if ($scope.certification_id == undefined) {
            $scope.certification_id = 0;
        }
          if($scope.certification_id == 0 || $scope.certification_id == null || $scope.certification_id == undefined){
        	$scope.isItNewCertificate = true;
        }else{
        	$scope.isItNewCertificate = false;
        }
        //file upload in certification table
        var file = $scope.certificationFile;
        //ends

        if ($scope.certification_id == 0) {
        	if($scope.organization_name.selectedOrgs.codeSet=="OTHER"){
        		
        	}else{
        		var file = $scope.certificationFile;
                if ($scope.course_name_selected.selectCourse.courseName == "" || $scope.course_name_selected.selectCourse.courseName == null || $scope.course_name_selected.selectCourse.courseName == undefined && file == undefined || file == "" || file == "No file" && $scope.organization_name.selectedOrgs.orgName == "" || $scope.organization_name.selectedOrgs.orgName == null || $scope.organization_name.selectedOrgs.orgName == undefined) {
                    notif({
                        type: "warning",
                        msg: "All the fields are not properly filled",
                        multiline: true,
                        position: "center",
                        timeout: 6000
                    });
                    return false;
                }
        	}
        }


        // var file = $scope.certificationFile;
        if ($scope.certification_id == 0) {
            if ($scope.status != "ST_START") {
            	if($scope.disableUploadFileDiv==false){
            		var file = $scope.certificationFile;
                    if (file == undefined || file == "" || file == "No file") {
                        notif({
                            type: "warning",
                            msg: "Please upload file",
                            multiline: true,
                            position: "center",
                            timeout: 6000
                        });
                        return false;
                    }
            	}
            }
        }

        if ($scope.certification_id != 0 && $scope.status != "ST_START") {
            if ($scope.existingCertificateFile == "No file" || $scope.existingCertificateFile == "" || $scope.existingCertificateFile == undefined || $scope.existingCertificateFile == null) {
            	if($scope.disableUploadFileDiv==false){
            		var file = $scope.certificationFile;
                    if (file == undefined || file == "" || file == "No file") {
                        notif({
                            type: "warning",
                            msg: "Please upload file",
                            multiline: true,
                            position: "center",
                            timeout: 6000
                        });
                        return false;
                    }
            	}
            }
        }

        if (file != undefined && file != "" && file != "No file") {
            $scope.updateCerFile = "yes";
            var type = file.type;
			
			var uploadedFileSize=file.size+"";
            if(5242880<Number(uploadedFileSize)){
            	var testsize = 5242880/1024;
            	testsize=testsize/1024;
            	notif({
					type : "warning",
					msg : "Uploaded File should be less than "+testsize+".MB",
					position : "center",
					multiline: true,
					timeout : 6000,
					autohide: true
				});
            	 return false;
            }
            
            $scope.isSpecialChar= documentValidation.checkForSpecialChar(file);
            if($scope.isSpecialChar==false){
          		 notif({
   					type : "warning",
   					msg : messageDefault.fileSpecChar,
   					position : "center",
   					multiline: true,
   					timeout : 6000,
   					autohide: true
   				});
   			 return false;
               }
            $scope.isDocName= documentValidation.checkForDocumentNameLenght(file);
            if($scope.isDocName==false){
            	notif({
					type : "warning",
					msg : messageDefault.fileLength,
					position : "center",
					multiline: true,
					timeout : 6000,
					autohide: true
				});
   			 return false;
               }
            if (type == "application/vnd.openxmlformats-officedocument.wordprocessingml.document" || type == "application/msword" || type == "application/pdf" || type == "application/vnd.ms-excel" || type == "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" || type == "image/jpeg" || type == "image/png") {
                var expriry_date = dateConvert.convertDateToMiliSecondForProfile($scope.expriry_date);
                var completion_date = dateConvert.convertDateToMiliSecondForProfile($scope.course_completion_date);
                var status_date = dateConvert.convertDateToMiliSecondForProfile($scope.status_date);
                if($scope.organization_name.selectedOrgs.codeSet=="OTHER"){
                	$scope.tempCourseName=$scope.otherCourseName;
                }else{
                	$scope.tempCourseName=$scope.course_name_selected.selectCourse.courseId
                }

                var dataObj = {
                    status: $scope.status,
                    status_date: status_date,
                    organization_name: $scope.organization_name.selectedOrgs.codeSet,
                    other_organization_name: $scope.otherProgrammeName,
                    course: $scope.tempCourseName,
                    course_completion_date: completion_date,
                    stage: parseInt($scope.certificate_stage),
                    main_or_refresher: $scope.mainOrRefresher,
                    completion_report: $scope.completed_score,
                    score: $scope.score,
                    expriry_date: expriry_date,
                    file_name: file.name,
                    member_id: $scope.member_id,
                    user_name: $scope.user_name,
                    certification_id: parseInt($scope.certification_id),
                    pageName: "certification",
                    is_deleted: false
                };
            } else {
                notif({
                    type: "warning",
                    msg: mesaages.plz_slt_doc_size,
                    multiline: true,
                    position: "center",
                    timeout: 6000
                });
                return false;
            }
        } else {
            var expriry_date = dateConvert.convertDateToMiliSecondForProfile($scope.expriry_date);
            var completion_date = dateConvert.convertDateToMiliSecondForProfile($scope.course_completion_date);
            var status_date = dateConvert.convertDateToMiliSecondForProfile($scope.status_date);
            if($scope.organization_name.selectedOrgs.codeSet=="OTHER"){
            	$scope.tempCourseName=$scope.otherCourseName;
            }else{
            	$scope.tempCourseName=$scope.course_name_selected.selectCourse.courseId
            }
            var dataObj = {
                status: $scope.status,
                status_date: status_date,
                organization_name: $scope.organization_name.selectedOrgs.codeSet,
                other_organization_name: $scope.otherProgrammeName,
                course: $scope.tempCourseName,
                course_completion_date: completion_date,
                stage: parseInt($scope.certificate_stage),
                main_or_refresher: $scope.mainOrRefresher,
                completion_report: $scope.completed_score,
                score: $scope.score,
                expriry_date: expriry_date,
                member_id: $scope.member_id,
                user_name: $scope.user_name,
                file_name: "",
                certification_id: parseInt($scope.certification_id),
                pageName: "certification",
                is_deleted: false
            };
        }


        var res = $http.post('add-user-certification-data', dataObj);
        res.success(function(data, status, headers, config) {
        	$scope.newCertificationId = data;
            $scope.message = data;
            if ($scope.message == 0) {
                notif({
                    type: "error",
                    msg: messages.cannot_add_sameCourse_org_status,
                    multiline: true,
                    position: "center",
                    timeout: 6000
                });
                return false;
            }

            /*if ($scope.organization_name.selectedOrgs.orgName == "" || $scope.organization_name.selectedOrgs.orgName == null || $scope.organization_name.selectedOrgs.orgName == undefined) {
                notif({
                    type: "error",
                    msg: messages.selectOrganizationName,
                    position: "center",
                    multiline: true,
                    timeout: 6000
                });
                return false;
            }
            if ($scope.course_name_selected.selectCourse.courseName == "" || $scope.course_name_selected.selectCourse.courseName == null || $scope.course_name_selected.selectCourse.courseName == undefined) {
                notif({
                    type: "error",
                    msg: messages.selectCourseName,
                    position: "center",
                    multiline: true,
                    timeout: 6000
                });
                return false;
            }
*/


            var uploadUrl = "upload-certificates";
            if (file != undefined && file != "" && file != "No file") {
            	$scope.isSpecialChar= documentValidation.checkForSpecialChar(file);
            	if($scope.isSpecialChar==false){
              		 notif({
       					type : "warning",
       					msg : messageDefault.fileSpecChar,
       					position : "center",
       					multiline: true,
       					timeout : 6000,
       					autohide: true
       				});
       			 return false;
                 }
            	 $scope.isDocName= documentValidation.checkForDocumentNameLenght(file);
            	 if($scope.isDocName==false){
                 	notif({
     					type : "warning",
     					msg : messageDefault.fileLength,
     					position : "center",
     					multiline: true,
     					timeout : 6000,
     					autohide: true
     				});
        			 return false;
                    }
                var type = file.type;
                if (type == "application/vnd.openxmlformats-officedocument.wordprocessingml.document" || type == "application/msword" || type == "application/pdf" || type == "application/vnd.ms-excel" || type == "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" || type == "image/jpeg" || type == "image/png") {
                    certificatUpload.uploadFileToUrl(file, uploadUrl, $scope);
                } else {
                    notif({
                        type: "warning",
                        msg: mesaages.plz_slt_doc_size,
                        multiline: true,
                        position: "center",
                        timeout: 6000
                    });

                    return false;
                }
            }

            $scope.certification_id = undefined;
            $scope.showorhideupdate = false;
            $scope.showorhideadd = true;
            $scope.showorhidecancelupdate = false;
            if ($scope.message != 0) {

                if ($scope.updateCerFile != "yes") {
                    notif({
                        type: "success",
                        msg: mesaages.cert_dtl_success_add,
                        multiline: true,
                        position: "center",
                        timeout: 6000
                    });
                }
                /*	 notif({
	 						  type: "success",
	 						  msg: mesaages.cert_dtl_success_add,
	 						  multiline:true,
	 						  position: "center",
	 						  timeout: 6000
	 						});*/
                $scope.showorhideupdate = false;
                $scope.showorhidecancelupdate = false;
                $scope.showorhideadd = true;
                $scope.orgstatus = true;
                $scope.statusvalue = true;
                angular.forEach($scope.codeSets, function(value, i) {
                        if (value.codeSet == 'ST_START') {
                            $scope.status = value.codeSet;
                        }
                    })
                    // $scope.status=$scope.status_names[0];
                $scope.status_date = $scope.convertTodayDate(new Date);
                $scope.organization_name.selectedOrgs = '';
                $scope.otherProgrammeName = '';
                $scope.otherCourseName = '';
                $scope.course_name_selected.selectCourse = '';
                $scope.certificate_stage = '';
                $scope.mainOrRefresher = '';
                $scope.course_completion_date = '';
                $scope.completed_score = '';
                $scope.score = '';
                $scope.expriry_date = '';
                $scope.repeatDuration = '';
                $scope.minPas = '';
                $scope.certification_id = 0;
                $scope.member_id = '';
                $scope.user_name = '';
                $scope.updateCerFile = '';
                $scope.certificationFile = undefined;
                $scope.hideCertificateFileNameLabel = true;
                $scope.showOtherProgNameDiv = false;
                $scope.isDisableSelectedField = true;
                $scope.status="";
                $scope.otherProgrammeName="";
                $scope.existingCertificateStatus ="";
                angular.element("input[type='file']").val(null);
                $scope.isDisableWhenCertificateEditMode =  false;

                $scope.file_name = '';
                $scope.certification.$setPristine(true);
               /* var actionUrlId = sessionStorage.getItem("userProfileActionUrlId");
                if (actionUrlId == "/update-user-profile/certifications") {
                    sessionStorage.removeItem("userProfileActionUrl");
                    sessionStorage.removeItem("userProfileActionUrlId");
                    $window.location.href = '#/home-page-sid';
                }*/

                $scope.genericMethod();
            }
            else {
                notif({
                    type: "error",
                    msg: mesaages.cert_dtl_not_add_plz_cont_adm,
                    position: "center",
                    multiline: true,
                    timeout: 6000
                });
            }
        });
        res.error(function(data, status, headers, config) {
            notif({
                type: "error",
                msg: mesaages.somth_wont_plz_cont_adm1,
                multiline: true,
                position: "center",
                timeout: 6000
            });
        });
        }else{
        		notif({
        		  type: "warning",
        		  msg: mesaages.kindltfilldata1,
        		  multiline:true,
        		  position: "center",
        		  timeout: 6000
        		});
        		$scope.isDisabled=false;
        	
           }

    }

    $scope.certificationCancel = function(certification) {
        /* $.confirm({
 		    title: mesaages.areusure,	    		   
 		    content_box: mesaages.signupconfirm,
 		  confirm: function(certification){*/
        highlightTableRowService.removeHighlight();
		$scope.isDisableWhenCertificateEditMode=false;
        $scope.showorhideupdate = false;
        $scope.showorhideadd = true;
        $scope.showorhidecancelupdate = false;
        //  $scope.status=$scope.status_names[0];
        angular.forEach($scope.codeSets, function(value, i) {
            if (value.codeSet == 'ST_START') {
                $scope.status = value.codeSet;
            }
        })
        $scope.status_date = $scope.convertTodayDate(new Date);
        $scope.organization_name.selectedOrgs = '';
        $scope.organization_new_name = '';
        $scope.course_name_selected.selectCourse = '';
        $scope.certificate_stage = '';
        $scope.mainOrRefresher = '';
        $scope.course_completion_date = '';
        $scope.completed_score = '';
        $scope.score = '';
        $scope.expriry_date = '';
        $scope.member_id = '';
        $scope.user_name = '';
        $scope.certification_id = 0;
        $scope.statusvalue = true;
        $scope.certificationFile = undefined;
        $scope.hideCertificateFileNameLabel = true;
        angular.element("input[type='file']").val(null);

        $scope.file_name = '';
        $scope.certification.$setPristine(true);
        /* $scope.$apply();
 		  }
		  
		  
		 	
 		});*/
    }


  
    $scope.deleteCertificateIfCertificateFailed= function(isNewCertificate,certificateId){
    	if(isNewCertificate){
    		  var dataObj = {
    		                   certificationid: parseInt(certificateId)
    		                 };
		    	var res = $http.post('delete-user-citi-certification-data', dataObj);
		    	  res.success(function(data, status, headers, config) {
		    	  $scope.genericMethod();
		    		$scope.certification_id = 0;
		    		 angular.element("input[type='file']").val(null);
		    		$scope.certification.$setPristine(true);
		    		$scope.showorhideupdate = false;
		    		$scope.showorhideadd = true;
		    		$scope.showorhidecancelupdate = true;
		    		$scope.ExistingCertificateDetails={};
		    	  });
		    	  res.error(function(data, status, headers, config) {
		    	   });
    	}else{
    		 var expriry_date;
    		  var completion_date;
    		  var status_date;
    		if(!!$scope.expriry_date && $scope.expriry_date != null){
    			expriry_date = dateConvert.convertDateToMiliSecondForProfile($scope.expriry_date);
    		}
    		if(!!$scope.course_completion_date && $scope.course_completion_date != null){
    			completion_date = dateConvert.convertDateToMiliSecondForProfile($scope.course_completion_date);
    		}
    		if(!!$scope.status_date && $scope.status_date != null){
    			status_date = dateConvert.convertDateToMiliSecondForProfile($scope.status_date);
    		}
    		$scope.existCertificateStage = undefined;
    		if(!!$scope.ExistingCertificateDetails.stage && $scope.ExistingCertificateDetails.stage != null){
    			$scope.existCertificateStage = parseInt($scope.ExistingCertificateDetails.stage);
    		}
    		var dataObj = {
    			    status: $scope.ExistingCertificateDetails.status,
                    status_date: status_date,
                    organization_name: $scope.ExistingCertificateDetails.orgnId,
                    other_organization_name: $scope.ExistingCertificateDetails.orgnId,
                    course: $scope.ExistingCertificateDetails.courseId,
                    course_completion_date: completion_date,
                    stage:$scope.existCertificateStage,
                    main_or_refresher: $scope.ExistingCertificateDetails.mainOrRefresher,
                    completion_report: $scope.ExistingCertificateDetails.completion_report,
                    score: $scope.ExistingCertificateDetails.reported_score,
                    expriry_date: expriry_date,
                    file_name: $scope.ExistingCertificateDetails.actualFileName,
                    ftpFileName : $scope.ExistingCertificateDetails.actualFtpFileName, 
                    member_id: $scope.ExistingCertificateDetails.memberId,
                    user_name: $scope.ExistingCertificateDetails.userName,
                    certification_id: $scope.ExistingCertificateDetails.certification_id,
                    pageName: "certification",
                    is_deleted: false
    		};
    		  var res = $http.post('add-user-certification-data', dataObj);
    	        res.success(function(data, status, headers, config) {
    	        	$scope.ExistingCertificateDetails={};
    	        	 $scope.genericMethod();
 		    		$scope.certification_id = 0;
 		    		 angular.element("input[type='file']").val(null);
 		    		$scope.certification.$setPristine(true);
 		    		$scope.showorhideupdate = false;
 		    		$scope.showorhideadd = true;
 		    		$scope.showorhidecancelupdate = true;
 		    		
 		    		 expriry_date=undefined;
 		    		  completion_date=undefined;
 		    		  status_date=undefined;
    	        });
		    	  res.error(function(data, status, headers, config) {
		    	   });
    	}
    	
    }
    /*onclick of next and back call this funtion starts here*/
    $scope.employmentback = function() {
        $scope.employmentdata.organization = $scope.org_name;
        $scope.employmentdata.research_site = $scope.research_site;
        $scope.employmentdata.corporation_no = $scope.corporation_no;
        $scope.employmentdata.department = $scope.department;
        $scope.employmentdata.section = $scope.section;
        $scope.employmentdata.designation = $scope.emp_designation;

        location.href = "#/qualification";
    }
    $scope.employmentnext = function() {



            $scope.employmentdata.organization = $scope.org_name;
            $scope.employmentdata.research_site = $scope.research_site;
            $scope.employmentdata.corporation_no = $scope.corporation_no;
            $scope.employmentdata.department = $scope.department;
            $scope.employmentdata.section = $scope.section;
            $scope.employmentdata.designation = $scope.emp_designation;
            location.href = "#/experience";

        }
        /*onclick of next and back call this funtion ends here*/
    $scope.employmentCancel = function() {
        swal({
                title: "Are you sure?",
                text: "If you cancel filled data will not be saved.",
                type: "warning",
                showCancelButton: true,
                confirmButtonColor: "#DD6B55",
                confirmButtonText: "Yes",
                cancelButtonText: "No",
                closeOnConfirm: false,
                closeOnCancel: false
            },
            function(isConfirm) {
                if (isConfirm) {
                    //implementation need to put
                    location.href = "update-user-profile";
                    swal("Cancelled!", "successfully");
                } else {
                    swal("Not Cancelled");
                }
            });
    }

}]);
/************Certification page ends here*******************/


/*************** passwordManagement controller***************/
/*--##########################----password-management page controller-----##########---############################# */
controllerModuleAPP.directive('fileModel', ['$parse', function($parse) {
    return {
        restrict: 'A',
        link: function(scope, element, attrs) {
            var model = $parse(attrs.fileModel);
            var modelSetter = model.assign;

            element.bind('change', function() {
                scope.$apply(function() {
                    modelSetter(scope, element[0].files[0]);
                });
            });
        }
    };
}]);
controllerModuleAPP.service('signatureUpload', ['$http', function($http) {
    this.uploadFileToUrl = function(file, uploadUrl, $scope) {
        var fd = new FormData();
        fd.append('file', file);

        $http.post(uploadUrl, fd, {
            transformRequest: angular.identity,
            headers: {
                'Content-Type': undefined
            }
        })

        .success(function(data, status, headers, config) {
            if (data == true) {
                $scope.old_pin_password = '';
                $scope.new_pin_password = '';
                $scope.confirm_pin_password = '';
                //$('#file_name').val('');
                angular.element("input[type='file']").val(null);

                $scope.changePinPassword.$setPristine(true)
                $scope.success = true;
                notif({
                    type: "success",
                    msg: mesaages.pin_pass_sign_updat_success,
                    multiline: true,
                    position: "center",
                    timeout: 6000
                });
                $scope.getSignatureDetails();
            } else if (data == false) {
                notif({
                    type: "success",
                    msg: mesaages.pin_pass_chang_but_unable_updat_sig,
                    multiline: true,
                    position: "center",
                    timeout: 6000
                });
            } else {
                notif({
                    type: "success",
                    msg: mesaages.somth_wron_plz_cont_adm,
                    multiline: true,
                    position: "center",
                    timeout: 6000
                });
            }
        })

        .error(function(data, status, headers, config) {
            notif({
                type: "error",
                msg: mesaages.som_prob_occr_upload_file,
                position: "center",
                multiline: true,
                timeout: 6000
            });
        });
    }
}]);

controllerModuleAPP.controller('password-management-controller', ['$scope', '$http', 'signatureUpload', '$compile', '$rootScope', 'componentService', function($scope, $http, signatureUpload, $compile, $rootScope, componentService) {
    $scope.disablePwdFields = false;
    $scope.upload_image = 'No';
    $scope.label1 = 'Yes';
    $scope.hideWhenPinIsDisable=false;
    /**
     * For uploading
     */
    $scope.getSignatureDetails = function() {
        var cvData = $http.get('get-user-signature');

        cvData.success(function(data, status, headers, config) {
        	if(data.length>0){
        		$scope.signatureImageData = data[0].singnature_Image;
                $scope.tempUploadImageRadio=data[0].is_sign_required;
                $scope.tempPinRadio=data[0].is_pin_required;
                $scope.upload_image=$scope.getStringFromBoolean(data[0].is_sign_required);
                $scope.label1=$scope.getStringFromBoolean($scope.tempPinRadio);
                $scope.userDetails = data[0];
                $scope.signature_value = $scope.userDetails.singnature_Image;
                if ($scope.userDetails.singnature_Image == null ||
                    $scope.userDetails.singnature_Image == undefined ||
                    $scope.userDetails.singnature_Image == '') {
                    $scope.signatureImage = true;
                } else {
                    $scope.signatureImage = false;
                }
                $scope.disablePasswordFields($scope.label1);
        	}
        });
    }
    $scope.getStringFromBoolean=function(booleanValue){
    	$scope.temString="No";
    	if(booleanValue!=undefined){
    		if(booleanValue==true){
    			$scope.temString="Yes";
    		}
    	}
    	return $scope.temString;
    }
    $scope.getSignatureDetails();

    $scope.disablePasswordFields = function(val) {
        if (val == 'Yes') {
            $scope.old_pin_password = '';
            $scope.new_pin_password = '';
            $scope.confirm_pin_password = '';
            $scope.disablePwdFields = false;
            $scope.hideWhenPinIsDisable=false;
        } else {
            $scope.old_pin_password = '';
            $scope.new_pin_password = '';
            $scope.confirm_pin_password = '';
            $scope.disablePwdFields = true;
            $scope.hideWhenPinIsDisable=true;
        }
    }
        /**
         * for access control module code
         */
    var  URL = window.location.href;
    requestedUrl  =  URL.substring(URL.lastIndexOf('/')  +  1);
    URL = "/" + requestedUrl;
    componentService.getSessionDataInPage($scope, URL);
    $scope.$MyService = componentService;


    /*myData contains the values of form data*/
    $scope.success = false;
    $scope.failure = false;
    $scope.error = false;
    $scope.old_password_error = false;
    $scope.confirm_password_error = false;
    $scope.invalid = false;
    $scope.isDisabled = true;
    $scope.passwordmsg = false;
    $scope.qamsg = false;
    $scope.add_seq_ques_warn = false;
    $scope.add_seq_ans_warn = false;
    $scope.add_seq_ques_ans_warn = false;
    $scope.add_seq_ques_duplicate_warn = false;
    /*$scope.upload=false;*/
    /*$scope.noupload=true;*/


    $scope.hideuploadfile = true;
    if ($scope.hideuploadfile == true) {
        $("#imageUpload").show();
        $scope.requiredOrNot = false;
        $scope.uploadedImage = false;
        $scope.uplodeimage = true;
        $scope.signatureUploadedImage = true;
    }


    $scope.enableChooseFile = function() {
        $("#imageUpload").show();
        $scope.requiredOrNot = true;
        $scope.uploadedImage = true;
        $scope.signatureUploadedImage = true;
        $scope.uplodeimage = false;
    }
    $scope.disableChooseFile = function() {
            $("#imageUpload").show();
            $scope.requiredOrNot = false;
            $scope.uploadedImage = false;
            $scope.uplodeimage = true;
            $scope.signatureUploadedImage = true;
        }
        /**
         * file upload code
         */
    $scope.uploadsignatureImage = function() { //var file = $scope.myFile;

        var image = $scope.myFile;
        var uploadUrl = "saveSignatureImage";
        if (image != undefined) {
            var type = image.type;
            if (1 == 1) {
                $scope.uploadSingnaturePic($scope.myFile, uploadUrl);
            } else {
                notif({
                    type: "error",
                    msg: "Please select jpeg file",
                    position: "center",
                    timeout: 6000
                });

                return false;
            }
        } else {
            notif({
                type: "warning",
                msg: "Please select a jpeg file",
                position: "center",
                timeout: 6000
            });
        }
    };

    $scope.uploadSingnaturePic = function(file, uploadUrl) {
        var fd = new FormData();
        fd.append('file', file);

        var res = $http.post(uploadUrl, fd, {
            transformRequest: angular.identity,
            headers: {
                'Content-Type': undefined
            }


        })
        res.success(function(data, status, headers, config) {
            if (data) {
                notif({
                    type: "success",
                    msg: messages.signatureSaved,
                    position: "center",
                    timeout: 6000,
                    append: false


                });
                $scope.pinPasswordCancel();
                $scope.getSignatureDetails();
                $scope.myFile = '';
                //var myVar = setInterval(test, 3000);
                //test();
            } else {
                notif({
                    type: "warning",
                    msg: mesaages.file_upload_fail,
                    position: "center",
                    timeout: 6000,
                    append: false
                });
            }
        });
        res.error(function(data, status, headers, config) {
            notif({
                type: "error",
                msg: mesaages.Somth_error_serv_plz_cont_serv_adm,
                position: "center",
                timeout: 6000,
                append: false
            });
        });
    }
    $http({
            method: 'GET',
            url: 'get-security-questions'
        })
        .success(function(data, status, headers, config) {
            $scope.secQuestion = data;
        })
        .error(function(data, status, headers, config) {
            $scope.error = true;
        });

    //change password form
    $scope.changePassword = function(form) {

        angular.forEach(form, function(obj) {
            if (angular.isObject(obj) && angular.isDefined(obj.$setDirty)) {
                obj.$setDirty();
            }
        })
        if (form.$valid) {
            if ($scope.old_password == '' || $scope.old_password == null) {
                notif({
                    type: "warning",
                    msg: mesaages.plz_provd_old_pass,
                    multiline: true,
                    position: "center",
                    timeout: 6000
                });
                return;
            }
            var re = /(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{7,}/;
            if (!re.test($scope.new_password)) {
                notif({
                    type: "warning",
                    msg: messages.password_strength_validation,
                    multiline: true,
                    position: "center",
                    timeout: 5000
                });
                return false;
            }
            if ($scope.new_password == '' || $scope.new_password == null) {
                notif({
                    type: "warning",
                    msg: mesaages.plz_provd_ur_new1_pass,
                    multiline: true,
                    position: "center",
                    timeout: 6000
                });
                return;
            }
            if ($scope.confirm_new_password == '' || $scope.confirm_new_password == null) {
                notif({
                    type: "warning",
                    msg: mesaages.plz_provd_ur_confirm_new1_pass,
                    multiline: true,
                    position: "center",
                    timeout: 6000
                });
                return;
            }
            var dataObj = {
                old_password: $scope.old_password,
                new_password: $scope.new_password,
                confirm_new_password: $scope.confirm_new_password
            }
            var myCallback = function() {
                location.href = "abhathlogin";
            }
            var res = $http.post('change-user-password', dataObj);
            res.success(function(data, status, headers, config) {
                $scope.message = data;
                if ($scope.message == 2) {
                    $scope.old_password = '';
                    $scope.new_password = '';
                    $scope.confirm_new_password = '';

                    $scope.PasswordForm.$setPristine(true);
                    $scope.success = true;
                    notif({
                        type: "success",
                        msg: mesaages.pass_chang_successfully,
                        multiline: true,
                        position: "center",
                        timeout: 6000,
                        'callback': myCallback
                    });
                } else if ($scope.message == 4) {
                    notif({
                        type: "warning",
                        msg: mesaages.new1_pass_n_confir_pass_r_not_same,
                        multiline: true,
                        position: "center",
                        timeout: 6000,
                    });
                    $scope.failure = true;
                    $scope.isDisabled = false;
                } else if ($scope.message == 1) {
                    notif({
                        type: "warning",
                        msg: mesaages.old_pass_enter_pass_r_not_same,
                        multiline: true,
                        position: "center",
                        timeout: 6000,
                    });
                    $scope.failure = true;
                    $scope.isDisabled = false;
                } else {
                    notif({
                        type: "warning",
                        msg: mesaages.somthing_wron_plz_ckec_adm,
                        multiline: true,
                        position: "center",
                        timeout: 6000,
                    });
                }
            });
            res.error(function(data, status, headers, config) {
                $scope.error = true;
                $scope.isDisabled = false;
                //alert( "Couldn't able to add user: " + data);
            });
        } else {

            notif({
                type: "warning",
                msg: mesaages.empty_fields,
                multiline: true,
                position: "center",
                timeout: 3000,

            });
            //$scope.isDisabled=false;
        }
    }

    $scope.passwordCancel = function() {
        $scope.old_password = '';
        $scope.new_password = '';
        $scope.confirm_new_password = '';
        $scope.PasswordForm.$setPristine(true);
    }

    /*// signature name start
    $scope.updateSignName = function() {
        var res = $http.get('get-user-details');
        res.success(function(data, status, headers, config) {
            console.log(data);
            $scope.userDetails = data[0];
            $scope.signature_value = $scope.userDetails.singnature_Image;

            $scope.signature_value_Nothr = $scope.userDetails.singnature_Image_Nothr;

            if ($scope.userDetails.singnature_Image == null ||
                $scope.userDetails.singnature_Image == undefined ||
                $scope.userDetails.singnature_Image == '') {
                $scope.signatureImage = true;
            } else {
                $scope.signatureImage = false;
            }

            $scope.signName = $scope.userDetails.singnature_name;
            //alert($scope.signature_name);
        });
    }
    $scope.updateSignName();*/
    // signature name end 

    ///Pin Password changing
    $scope.updatePinPwd = function(form) {
            angular.forEach(form, function(obj) {
                if (angular.isObject(obj) && angular.isDefined(obj.$setDirty)) {
                    obj.$setDirty();
                }
            })

            if ($scope.label1 == 'Yes') {
                if ($scope.old_pin_password == '' || $scope.old_pin_password == null) {
                    notif({
                        type: "warning",
                        msg: mesaages.plz_provid_old_pass,
                        multiline: true,
                        position: "center",
                        timeout: 6000
                    });
                    return;
                }
                if ($scope.new_pin_password == '' || $scope.new_pin_password == null) {
                    notif({
                        type: "warning",
                        msg: mesaages.plz_provid_new1_pin_pass,
                        multiline: true,
                        position: "center",
                        timeout: 6000
                    });
                    return;
                }
                if ($scope.confirm_pin_password == '' || $scope.confirm_pin_password == null) {
                    notif({
                        type: "warning",
                        msg: mesaages.plz_provid_confrm_pin_pass,
                        multiline: true,
                        position: "center",
                        timeout: 6000
                    });
                    return;
                }
               
                var dataObj = {
                    old_pin: $scope.old_pin_password,
                    new_pin: $scope.new_pin_password,
                    confirmed_pin: $scope.confirm_pin_password,
                    is_pin_required: true
                }
                var res = $http.post('change-pin-pwd', dataObj);
                res.success(function(data, status, headers, config) {
                    $scope.message = data;
                    if ($scope.message == 2) {
                        notif({
                            type: "success",
                            msg: mesaages.pin_pass_upload_success,
                            multiline: true,
                            position: "center",
                            timeout: 6000
                        });
                        $scope.pinPasswordCancel();
                        $scope.getSignatureDetails();
                        $scope.old_password = '';
                        $scope.new_password = '';
                        $scope.confirm_new_password = '';
                    } else if ($scope.message == 4) {
                        notif({
                            type: "warning",
                            msg: mesaages.new1_pin_pass_confir_pin_pass_not_same,
                            multiline: true,
                            position: "center",
                            timeout: 6000,
                        });
                        $scope.failure = true;
                        $scope.isDisabled = false;
                    } else if ($scope.message == 1) {
                        notif({
                            type: "warning",
                            msg: mesaages.old_pin_pass_enter_old_pin_not_same,
                            multiline: true,
                            position: "center",
                            timeout: 6000,
                        });
                        $scope.failure = true;
                        $scope.isDisabled = false;
                    } else {
                        notif({
                            type: "warning",
                            msg: mesaages.somth_wrng_plz1_cont_adm,
                            multiline: true,
                            position: "center",
                            timeout: 6000,
                        });
                    }
                });
                res.error(function(data, status, headers, config) {
                    $scope.error = true;
                    $scope.isDisabled = false;
                });
            } else if ($scope.label1 == 'No') {
                var dataObj = {
                    is_pin_required: false
                }
                var res = $http.post('change-pin-pwd', dataObj);
                res.success(function(data, status, headers, config) {
                    $scope.message = data;
                    if ($scope.message == 2) {
                    	if($scope.label1 == 'No')
                    	{
                            notif({
                                type: "success",
                                msg: mesaages.pin_pass_upload_disbled_success,
                                multiline: true,
                                position: "center",
                                timeout: 6000
                            });
                            $scope.pinPasswordCancel();
                            $scope.getSignatureDetails();
                            $scope.old_password = '';
                            $scope.new_password = '';
                            $scope.confirm_new_password = '';
                    	}
                    	else
                    	{
                            notif({
                                type: "success",
                                msg: mesaages.pin_pass_upload_success,
                                multiline: true,
                                position: "center",
                                timeout: 6000
                            });
                            $scope.pinPasswordCancel();
                            $scope.getSignatureDetails();
                            $scope.old_password = '';
                            $scope.new_password = '';
                            $scope.confirm_new_password = '';
                        
                    	}
                    } else {
                        notif({
                            type: "warning",
                            msg: mesaages.somth_wrng_plz1_cont_adm,
                            multiline: true,
                            position: "center",
                            timeout: 6000,
                        });
                    }
                });
                res.error(function(data, status, headers, config) {
                    $scope.error = true;
                    $scope.isDisabled = false;
                });

            }
        }
    $scope.uploadUserSignature = function() {
        if ($scope.upload_image == "Yes") {
            $scope.uploadsignatureImage(); //upload-signature
        }
        if ($scope.upload_image == "No") {
            var res = $http.post('save-user-without-signature');
            res.success(function(data, status, headers, config) {
                if (data) {
                    notif({
                        type: "success",
                        msg: messages.signatureSavedwithoutsign,
                        position: "center",
                        timeout: 6000,
                        append: false
                    });
                    $scope.getSignatureDetails();
                }
            });
            res.error(function(data, status, headers, config) {
                notif({
                    type: "error",
                    msg: mesaages.Somth_error_serv_plz_cont_serv_adm,
                    position: "center",
                    timeout: 6000,
                    append: false
                });
            });

        }
    }

    $scope.pinPasswordCancel = function() {
        $scope.old_pin_password = '';
        $scope.new_pin_password = '';
        $scope.confirm_pin_password = '';
        /*angular.element("input[type='file']").val(null);
        $scope.upload_image="noupload";
        $scope.disableChooseFile();*/
        $scope.PinPasswordForm.$setPristine(true);
    }
    $scope.signatureCancel = function() {
        angular.element("input[type='file']").val(null);
    }

    $scope.updateSecurityQuestion = function(form) {
        angular.forEach(form, function(obj) {
            if (angular.isObject(obj) && angular.isDefined(obj.$setDirty)) {
                obj.$setDirty();
            }
        })
        if (form.$valid) {
            if ($scope.pin_security_question == null || $scope.pin_security_question == undefined) {
                notif({
                    type: "warning",
                    msg: mesaages.plz_slt_securt_quest,
                    multiline: true,
                    position: "center",
                    timeout: 6000,
                });
                return false;
            }
            if ($scope.pinpasswordanswer == null || $scope.pinpasswordanswer == '') {
                notif({
                    type: "warning",
                    msg: mesaages.plz_wrt_ur_ans,
                    multiline: true,
                    position: "center",
                    timeout: 6000,
                });
                return false;
            }

            //change-security-ques,security_question_id,answer
            var dataObj = {
                security_question_id: $scope.pin_security_question.security_question_id,
                answer: $scope.pinpasswordanswer
            }
            var res = $http.post('change-security-ques', dataObj);
            res.success(function(data, status, headers, config) {
                $scope.message = data;
                if ($scope.message == true) {
                    $scope.pin_security_question = '';
                    $scope.pinpasswordanswer = '';

                    $scope.PasswordsecurityQues.$setPristine(true)
                    $scope.success = true;
                    notif({
                        type: "success",
                        msg: mesaages.securt_quest_ans_update_success,
                        multiline: true,
                        position: "center",
                        timeout: 6000
                    });
                } else {
                    notif({
                        type: "warning",
                        msg: mesaages.somth_went_wrog_plz_cont_adm,
                        multiline: true,
                        position: "center",
                        timeout: 6000,
                    });
                }
            });
            res.error(function(data, status, headers, config) {
                $scope.error = true;
                $scope.isDisabled = false;
                //alert( "Couldn't able to add user: " + data);
            });
        } else {

            notif({
                type: "warning",
                msg: mesaages.empty_fields,
                multiline: true,
                position: "center",
                timeout: 3000,

            });
            //$scope.isDisabled=false;
        }
    };
    $scope.secQuesCancel = function() {
        $scope.pin_security_question = '';
        $scope.pinpasswordanswer = '';
        $scope.PasswordsecurityQues.$setPristine(true);
    }


    $scope.params = {};
    $scope.showPassword = false;
    $scope.showconfirm_password = false;




    $scope.showconfirm_passwordoldpin = false;




    $scope.oldpassword = 'password';
    $scope.toggleShowconfirmoldpassword = function() {
        if ($scope.oldpassword == 'password')
            $scope.oldpassword = 'text';
        else
            $scope.oldpassword = 'password';
    }


    $scope.dragpassword = function() {
        if ($scope.oldpassword == 'password')
            $scope.oldpassword = 'password';
        else
            $scope.oldpassword = 'password';
    }



    $scope.newpassword = 'password';
    $scope.toggleShowconfirmpassword = function() {
        if ($scope.newpassword == 'password')
            $scope.newpassword = 'text';
        else
            $scope.newpassword = 'password';
    }


    $scope.dragconfpasswordtype = function() {
        if ($scope.newpassword == 'password')
            $scope.newpassword = 'password';
        else
            $scope.newpassword = 'password';
    }




    $scope.confirmnewpassword = 'password';
    $scope.toggleShowPassword = function() {
        if ($scope.confirmnewpassword == 'password')
            $scope.confirmnewpassword = 'text';
        else
            $scope.confirmnewpassword = 'password';
    }

    $scope.dragpasswordtype = function() {
        if ($scope.confirmnewpassword == 'password')
            $scope.confirmnewpassword = 'password';
        else
            $scope.confirmnewpassword = 'password';
    }


    ///////////////---------------------------------pinpasswprd ----------  
    $scope.pinnewpassword = 'password';
    $scope.toggleShowconfirmpasswordoldpin = function() {
        if ($scope.pinnewpassword == 'password')
            $scope.pinnewpassword = 'text';
        else
            $scope.pinnewpassword = 'password';
    }

    $scope.pindragpasswordtype = function() {
        if ($scope.pinnewpassword == 'password')
            $scope.pinnewpassword = 'password';
        else
            $scope.pinnewpassword = 'password';
    }

    /////////////--------------		 
    $scope.newpinnewpassword = 'password';
    $scope.passwordshowforpin = function() {
        if ($scope.newpinnewpassword == 'password')
            $scope.newpinnewpassword = 'text';
        else
            $scope.newpinnewpassword = 'password';
    }

    $scope.newpindragpasswordtype = function() {
            if ($scope.newpinnewpassword == 'password')
                $scope.newpinnewpassword = 'password';
            else
                $scope.newpinnewpassword = 'password';
        }
        /////////////--------------		
    $scope.confirnewpinnewpassword = 'password';
    $scope.toggleShowconfirmpasswordpin = function() {
        if ($scope.confirnewpinnewpassword == 'password')
            $scope.confirnewpinnewpassword = 'text';
        else
            $scope.confirnewpinnewpassword = 'password';
    }

    $scope.confirpinnewpassword = function() {
        if ($scope.confirnewpinnewpassword == 'password')
            $scope.confirnewpinnewpassword = 'password';
        else
            $scope.confirnewpinnewpassword = 'password';
    }

    ///////////////---------------------------------pinpasswprd ----------      



    $scope.inputType = 'password';
    $scope.togglepasswordtype = function() {
        if ($scope.inputType == 'password')
            $scope.inputType = 'text';
        else
            $scope.inputType = 'password';
    };

    $scope.togglepasswordshowforpin = function() {
        if ($scope.inputType == 'password')
            $scope.inputType = 'text';
        else
            $scope.inputType = 'password';
    };

    $scope.togglepasswordshowforconfirmpin = function() {
        if ($scope.inputType == 'password')
            $scope.inputType = 'text';
        else
            $scope.inputType = 'password';
    };

    $scope.disablePasswordFields = function(val) {
        if (val == 'Yes') {
            $scope.old_pin_password = '';
            $scope.new_pin_password = '';
            $scope.confirm_pin_password = '';
            $scope.disablePwdFields = false;
            $scope.hideWhenPinIsDisable=false;
        } else {
            $scope.old_pin_password = '';
            $scope.new_pin_password = '';
            $scope.confirm_pin_password = '';
            $scope.disablePwdFields = true;
            $scope.hideWhenPinIsDisable=true;
        }
    }
$scope.reserUserPinPassword=function(){
	var res = $http.post('reset-user-pin');
    res.success(function(data, status, headers, config) {
     if(data.success!=undefined){
    	notif({
                type: "success",
                msg:"Your PIN has been reset to " +data.success,
                position: "center",
                timeout: 6000,
                append: false
            });
    	 $scope.pinPasswordCancel();
    	}else{
    		 notif({
    	            type: "error",
    	            msg: mesaages.Somth_error_serv_plz_cont_serv_adm,
    	            position: "center",
    	            timeout: 6000,
    	            append: false
    	        });
    	}
    });
    res.error(function(data, status, headers, config) {
        notif({
            type: "error",
            msg: mesaages.Somth_error_serv_plz_cont_serv_adm,
            position: "center",
            timeout: 6000,
            append: false
        });
    });
}

$scope.enableMessageForHMCUsers=function(){
	var categoryType = {
			   CATG_TYPE : "ActiveDirectory"
         }
			
         var res = $http.post('get-default-setting-type-for-category-type', categoryType);
         res.success(function(data, status, headers, config) {
        	 $scope.defaultsettingTypes=data;
         	if($scope.defaultsettingTypes!=undefined){
         		$.each($scope.defaultsettingTypes,function(key,value){
        			var objectKeys=Object.keys(value);
        			if(objectKeys == "HMCQA"){
        					$scope.isEnableForHMCUsers = value["HMCQA"] == "Y" ? true : false;
        			}
        		});
         	}
        	 
         });
         res.error(function(data, status, headers, config) {});
}
$scope.enableMessageForHMCUsers();

}]);
/***************contact info page controller**************************/
controllerModuleAPP.controller('contact-info-controller', ['$scope', 'userPersonalDetails', '$http', '$compile', '$rootScope', 'componentService', function($scope, userPersonalDetails, $http, $compile, $rootScope, componentService) {

    /**
     * for access control module code
     */
    var  URL = window.location.href;
    requestedUrl  =  URL.substring(URL.lastIndexOf('/')  +  1);
    URL = "/" + requestedUrl;
    componentService.getSessionDataInPage($scope, URL);
    $scope.$MyService = componentService;

    $scope.userContactInfoDetails = userPersonalDetails.data;
    $scope.success = false;
    $scope.failure = false;
    $scope.error = false;
    $scope.invalid = false;
    $scope.isDisabled = false;

    /**********contact info page form data********************/
    $scope.city_list = [


        {
            'city': 'Doha'
        }
    ];

    $scope.state_list = [{
        'state': 'NA'
    }];

    $scope.Country_list = [{
        'Country': 'Qatar'
    }];


    $scope.addressline1 = $scope.userContactInfoDetails.contact_address1;
    $scope.addressline2 = $scope.userContactInfoDetails.contact_address2;
    $scope.city = $scope.userContactInfoDetails.contact_city;
    $scope.state = $scope.userContactInfoDetails.contact_state;
    $scope.Country = $scope.userContactInfoDetails.contact_Country;
    $scope.resident_phone_number = $scope.userContactInfoDetails.contact_residential_no;
    $scope.contactinfo_mobile_number = $scope.userContactInfoDetails.contact_mobile_no;
    $scope.a_address = $scope.userContactInfoDetails.contact_other_address;
    $scope.cityDetails = $scope.city_list;
    $scope.stateDetails = $scope.state_list;
    $scope.countryDetails = $scope.Country_list;

    /*save the data onclick of saveforlater(personalinfo and password data management) button starts here*/
    $scope.saveContactInfoDetails = function(form) {
            angular.forEach(form, function(obj) {
                if (angular.isObject(obj) && angular.isDefined(obj.$setDirty)) {
                    obj.$setDirty();
                }
            })
            $scope.userContactInfoDetails.contact_address1 = $scope.addressline1;
            $scope.userContactInfoDetails.contact_address2 = $scope.addressline2;
            $scope.userContactInfoDetails.contact_city = $scope.city;
            $scope.userContactInfoDetails.contact_state = $scope.state;
            $scope.userContactInfoDetails.contact_Country = $scope.Country;
            $scope.userContactInfoDetails.contact_residential_no = $scope.resident_phone_number;
            $scope.userContactInfoDetails.contact_mobile_no = $scope.contactinfo_mobile_number;
            $scope.userContactInfoDetails.contact_other_address = $scope.a_address;
            if (form.$valid) {
                var dataObj = {
                    userProfileInfoData: $scope.userContactInfoDetails



                };
                var res = $http.post('save-user-profile-data', dataObj);
                res.success(function(data, status, headers, config) {
                    $scope.message = data;
                    if ($scope.message == true) {
                        notif({
                            type: "success",
                            msg: "Contact Info Details saved successfully",
                            multiline: true,
                            position: "center",
                            timeout: 6000
                        });
                        $scope.isDisabled = false;
                    } else {
                        //alert("User not added.Please contact admin");
                        //$scope.failure=true;
                        notif({
                            type: "error",
                            msg: "Contact Info Details Is Not Added.Please Contact Admin.",
                            multiline: true,
                            position: "center",
                            timeout: 6000
                        });
                        $scope.isDisabled = false;
                    }
                });
                res.error(function(data, status, headers, config) {
                    notif({
                        type: "warning",
                        msg: "Something Went Wrong.Please Contact Admin.",
                        multiline: true,
                        position: "center",
                        timeout: 6000
                    });
                    $scope.isDisabled = false;
                });

            } else {
                notif({
                    type: "warning",
                    msg: "please fill all the fields properly",
                    multiline: true,
                    position: "center",
                    timeout: 6000
                });
                //$scope.invalid=true;
            }
        }
        /*save the data onclick of saveforlater(personalinfo and password data management) button ends here*/
        /*onclick of next and back call this funtion starts here*/
    $scope.contactInfoback = function() {
        $scope.userContactInfoDetails.contact_address1 = $scope.addressline1;
        $scope.userContactInfoDetails.contact_address2 = $scope.addressline2;
        $scope.userContactInfoDetails.contact_city = $scope.city;
        $scope.userContactInfoDetails.contact_state = $scope.state;
        $scope.userContactInfoDetails.contact_Country = $scope.Country;
        $scope.userContactInfoDetails.contact_residential_no = $scope.resident_phone_number;
        $scope.userContactInfoDetails.contact_mobile_no = $scope.contactinfo_mobile_number;
        $scope.userContactInfoDetails.contact_other_address = $scope.a_address;

        location.href = "#/password-management";


    }
    $scope.contactInfonext = function(form) {


            angular.forEach(form, function(obj) {
                if (angular.isObject(obj) && angular.isDefined(obj.$setDirty)) {
                    obj.$setDirty();
                }
            })
            if (form.$valid) {
                $scope.userContactInfoDetails.contact_address1 = $scope.addressline1;
                $scope.userContactInfoDetails.contact_address2 = $scope.addressline2;
                $scope.userContactInfoDetails.contact_city = $scope.city;
                $scope.userContactInfoDetails.contact_state = $scope.state;
                $scope.userContactInfoDetails.contact_Country = $scope.Country;
                $scope.userContactInfoDetails.contact_residential_no = $scope.resident_phone_number;
                $scope.userContactInfoDetails.contact_mobile_no = $scope.contactinfo_mobile_number;
                $scope.userContactInfoDetails.contact_other_address = $scope.a_address;
                location.href = "#/qualification";
            } else {
                notif({
                    type: "warning",
                    msg: "please fill all the fields properly",
                    multiline: true,
                    position: "center",
                    timeout: 6000
                });
                //$scope.invalid=true;
            }
        }
        /*onclick of next and back call this funtion ends here*/
    $scope.contactInfoCancel = function() {
        swal({
                title: "Are you sure?",
                text: "If you cancel filled data will not be saved.",
                type: "warning",
                showCancelButton: true,
                confirmButtonColor: "#DD6B55",
                confirmButtonText: "Yes",
                cancelButtonText: "No",
                closeOnConfirm: false,
                closeOnCancel: false
            },
            function(isConfirm) {
                if (isConfirm) {
                    //implementation need to put
                    location.href = "update-user-profile";
                    swal("Cancelled!", "successfully");
                } else {
                    swal("Not Cancelled");
                }
            });
    }
}]);
/**************qualification page controller***********************/
controllerModuleAPP.directive('fdInput', ['$timeout', function($scope, $timeout) {
    return {
        link: function(scope, element, attrs) {
            element.on('change', function(evt) {
                var files = evt.target.files;
                $scope.upload = files[0].name;
                console.log(files[0].name);
                console.log(files[0].size);
            });
        }
    }
}]);

controllerModuleAPP.controller('qualification-page-controller', ['$scope', 'userPersonalDetails', '$http', function($scope, userPersonalDetails, $http) {
    //get the list of Section
    $http({
            method: 'GET',
            url: 'get-all-skillSet'
        })
        .success(function(data, status, headers, config) {
            $scope.skillSetList = data;
        })
        .error(function(data, status, headers, config) {
            $scope.error = true;
        });

    //get the list of Research Site
    $http({
            method: 'GET',
            url: 'get-all-skillSetLevel'
        })
        .success(function(data, status, headers, config) {
            $scope.skillSetLevel = data;
        })
        .error(function(data, status, headers, config) {
            $scope.error = true;
        });

    /*myData contains the values of form data*/
    $scope.qualificationdata = userPersonalDetails.data;

    $scope.qualification = $scope.qualificationdata.qualificationDetails;
    $scope.skillSetDetails = $scope.qualificationdata.userCertificationsDetails;
    $scope.file = 'Certificate.pdf';

    $scope.addCertificationDetails = function() {
        $scope.inserted = {
            issue_date: '',
            TypeofCeritifcation: '',
            issuingBody: '',
            skill_set: '',
            skill_designation: '',
            expiry_date: '',
            certification_table_id: ''
        };
        $scope.skillSetDetails.push($scope.inserted);
        $scope.qualificationdata.userCertificationsDetails = $scope.skillSetDetails;
    };

    $scope.removeCertificationDetails = function(index) {
        $scope.skillSetDetails.splice(index, 1);
    };


    $scope.addQualification = function() {
        $scope.inserted = {
            name_of_credentials: '',
            study_area: '',
            type_of_credentials: '',
            date_of_joining: '',
            institution_name: '',
            institution_details: '',
            qualification_table_id: ''

        };
        $scope.qualification.push($scope.inserted);
        $scope.qualificationdata.qualificationDetails = $scope.qualification;
    };

    $scope.removeQualification = function(index) {
        var removeDataObj = {
            tableRowToBedeleted: $scope.qualification.splice(index, 1)
        };
        var res = $http.post('delete-user-profile-data', removeDataObj);
        $scope.qualification.splice(index, 1);
    };

    $scope.saveQualicationDetails = function() {

        var dataObj = {
            userProfileInfoData: $scope.qualificationdata,


        };
        var res = $http.post('save-user-profile-data', dataObj);

        res.success(function(data, status, headers, config) {
            $scope.message = data;
            if ($scope.message == true) {

                notif({
                    type: "success",
                    msg: mesaages.quali_certi_dtl_success_add,
                    multiline: true,
                    position: "center",
                    timeout: 6000
                });
            } else {
                notif({
                    type: "error",
                    msg: mesaages.quali_certi_dtl_not_add_plz_adm,
                    multiline: true,
                    position: "center",
                    timeout: 6000
                });
            }
        });
        res.error(function(data, status, headers, config) {
            notif({
                type: "error",
                msg: mesaages.somth_wnt_wrong_plz_adm,
                multiline: true,
                position: "center",
                timeout: 6000
            });
        });



    }



    /*onclick of back call this funtion starts here*/
    $scope.qualificationback = function() {
        location.href = "#/contach-info";
    }
    $scope.qualificationnext = function() {
            location.href = "#/employment";
        }
        /*onclick of back call this funtion ends here*/
    $scope.qualificationCancel = function() {
        swal({
                title: "Are you sure?",
                text: "If you cancel filled data will not be saved.",
                type: "warning",
                showCancelButton: true,
                confirmButtonColor: "#DD6B55",
                confirmButtonText: "Yes",
                cancelButtonText: "No",
                closeOnConfirm: false,
                closeOnCancel: false
            },
            function(isConfirm) {
                if (isConfirm) {
                    //implementation need to put
                    location.href = "update-user-profile";
                    swal("Cancelled!", "successfully");
                } else {
                    swal("Not Cancelled");
                }
            });
    }


}]);
/*********employment controller***************************/
controllerModuleAPP.controller('employment-page-controller', ['$scope', 'userPersonalDetails', '$http', function($scope, userPersonalDetails, $http) {
    /*myData contains the values of form data*/
    $scope.employmentdata = userPersonalDetails.data;
    $scope.success = false;
    $scope.failure = false;
    $scope.error = false;
    $scope.invalid = false;
    $scope.isDisabled = false;
    $scope.areaOfInterestData = $scope.employmentdata.areaOfInterestDetails;

    /*//get the list of organisations
  $http({method : 'GET',url : 'get-org-list'})
   .success(function(data, status, headers, config) {
 	  $scope.orgList = data;
   })
   .error(function(data, status, headers, config) {
 		  $scope.error=true;
   });
	
 //get the list of Department
  $http({method : 'GET',url : 'get-all-department'})
   .success(function(data, status, headers, config) {
 	  $scope.depList = data;
   })
   .error(function(data, status, headers, config) {
 		  $scope.error=true;
   });
  
 //get the list of Section
  $http({method : 'GET',url : 'get-all-section'})
   .success(function(data, status, headers, config) {
 	  $scope.secList = data;
   })
   .error(function(data, status, headers, config) {
 		  $scope.error=true;
   });
  
 //get the list of Research Site
  $http({method : 'GET',url : 'get-all-resrch-site'})
   .success(function(data, status, headers, config) {
 	  $scope.resSiteList = data;
   })
   .error(function(data, status, headers, config) {
 		  $scope.error=true;
   });
	
 $scope.org_name=$scope.employmentdata.organization;
 $scope.research_site=$scope.employmentdata.research_site;
 $scope.corporation_no=$scope.employmentdata.corporation_no;
 $scope.department=$scope.employmentdata.department;
 $scope.section=$scope.employmentdata.section;
 $scope.emp_designation=$scope.employmentdata.designation;*/
    $scope.researchArea = [{
        r_area: 'Heart'
    }, {
        r_area: 'Brain'
    }];
    $scope.speciality = [{
        speciality: 'Cordio'
    }, {
        speciality: 'Nurology'
    }];
    $scope.subSpeciality = [{
        subspeciality: 'engio'
    }, {
        subspeciality: 'neuro'
    }];
    $scope.reviewerAvailability = [{
        isReviewer: 'Yes'
    }, {
        isReviewer: 'No'
    }];


    $scope.addUserAreaofInterest = function() {
        $scope.inserted = {
            research_area: '',
            speciality: '',
            //sub_speciality: '',
            keyword1: '',
            keyword2: '',
            keyword3: '',
            keyword4: '',
            research_interest: '',
            //reviewer:''
        };
        $scope.areaOfInterestData.areaOfInterestInformation.push($scope.inserted);
        $scope.employmentdata.employmentDetails = $scope.areaOfInterestData.areaOfInterestInformation;
    };

    $scope.removeEmployment = function(index) {
        $scope.employment.splice(index, 1);
    };

    $scope.userareaOfInterest = $scope.areaOfInterestData.areaOfInterestInformation;
    $scope.saveUesrAreaOfInterest = function() {

            /*angular.forEach(form, function(obj){
            		if(angular.isObject(obj) && angular.isDefined(obj.$setDirty))
            		{ 
            			obj.$setDirty();                                                   
            		}
            	})*/

            /*$scope.employmentdata.organization=$scope.org_name;
            $scope.employmentdata.research_site= $scope.research_site;
            $scope.employmentdata.corporation_no=$scope.corporation_no;
            $scope.employmentdata.department=$scope.department;
            $scope.employmentdata.section=$scope.section;
            $scope.employmentdata.designation=$scope.emp_designation;*/


            /*    if(form.$valid){*/
            var dataObj = {
                userProfileInfoData: $scope.employmentdata,
                pageName: "area_of_interest"
            };
            var res = $http.post('update-user-profile-data', dataObj);
            res.success(function(data, status, headers, config) {
                $scope.message = data;
                if ($scope.message == true) {

                    notif({
                        type: "success",
                        msg: "Employment Details Successfully Added.",
                        multiline: true,
                        position: "center",
                        timeout: 6000
                    });
                } else {
                    notif({
                        type: "error",
                        msg: "Employment Details Is Not Added.Please Contact Admin.",
                        position: "center",
                        multiline: true,
                        timeout: 6000
                    });
                }
            });
            res.error(function(data, status, headers, config) {
                notif({
                    type: "error",
                    msg: "Something Went Wrong.Please Contact Admin.",
                    multiline: true,
                    position: "center",
                    timeout: 6000
                });
            });
            /* }else{
		notif({
		  type: "warning",
		  msg: "kindly fill data",
		  position: "center",
		  timeout: 5000
		});
		$scope.isDisabled=false;
	//$scope.invalid=true;
 }

		 */


        }
        /*onclick of next and back call this funtion starts here*/
    $scope.employmentback = function() {
        $scope.employmentdata.organization = $scope.org_name;
        $scope.employmentdata.research_site = $scope.research_site;
        $scope.employmentdata.corporation_no = $scope.corporation_no;
        $scope.employmentdata.department = $scope.department;
        $scope.employmentdata.section = $scope.section;
        $scope.employmentdata.designation = $scope.emp_designation;

        location.href = "#/qualification";
    }
    $scope.employmentnext = function() {



            $scope.employmentdata.organization = $scope.org_name;
            $scope.employmentdata.research_site = $scope.research_site;
            $scope.employmentdata.corporation_no = $scope.corporation_no;
            $scope.employmentdata.department = $scope.department;
            $scope.employmentdata.section = $scope.section;
            $scope.employmentdata.designation = $scope.emp_designation;
            location.href = "#/experience";

        }
        /*onclick of next and back call this funtion ends here*/
    $scope.employmentCancel = function() {
        swal({
                title: "Are you sure?",
                text: "If you cancel filled data will not be saved.",
                type: "warning",
                showCancelButton: true,
                confirmButtonColor: "#DD6B55",
                confirmButtonText: "Yes",
                cancelButtonText: "No",
                closeOnConfirm: false,
                closeOnCancel: false
            },
            function(isConfirm) {
                if (isConfirm) {
                    //implementation need to put
                    location.href = "update-user-profile";
                    swal("Cancelled!", "successfully");
                } else {
                    swal("Not Cancelled");
                }
            });
    }

}]);



/************************experience page****************************/
controllerModuleAPP.controller('experience-page-controller', ['$scope', 'userPersonalDetails', '$http', function($scope, userPersonalDetails, $http) {
    /*myData contains the values of form data*/
    $scope.researchexperiencedata = userPersonalDetails.data;
    $scope.success = false;
    $scope.failure = false;
    $scope.error = false;
    $scope.invalid = false;
    $scope.isDisabled = false;

    $scope.researchexperience = $scope.researchexperiencedata.researchexperienceDetails;

    $scope.studyRole = [{
        role: 'Principal Investigator'
    }, {
        role: 'Data Analyst'
    }];

    $scope.status = [{
        status: 'Completed'
    }, {
        status: 'Not Completed'
    }, {
        status: 'Suspended'
    }];


    $scope.addResearchDeatails = function() {
        $scope.inserted = {
            research_title: '',
            research_start_date: '',
            research_end_date: '',
            study_role: '',
            research_site_details: '',
            research_experience_detailsS_status: '',
            experience_table_id: ''
        };
        $scope.researchexperience.push($scope.inserted);
        $scope.researchexperiencedata.researchexperienceDetails = $scope.researchexperience;
    };

    $scope.removeResearchExp = function(index) {
        $scope.researchexperience.splice(index, 1);
    };
    $scope.saveExperience = function() {
        var dataObj = {
            userProfileInfoData: $scope.researchexperiencedata,


        };
        var res = $http.post('save-user-profile-data', dataObj);

        res.success(function(data, status, headers, config) {
            $scope.message = data;
            if ($scope.message == true) {

                notif({
                    type: "success",
                    msg: "Research Experience Details Successfully Added.",
                    multiline: true,
                    position: "center",
                    timeout: 6000
                });
            } else {
                notif({
                    type: "error",
                    msg: "Research Experience Details Is Not Added.Please Contact Admin.",
                    multiline: true,
                    position: "center",
                    timeout: 6000
                });
            }
        });
        res.error(function(data, status, headers, config) {
            notif({
                type: "error",
                msg: "Something Went Wrong.Please Contact Admin.",
                multiline: true,
                position: "center",
                timeout: 6000
            });
        });


    }


    /*onclick of next and back call this funtion starts here*/
    $scope.experienceback = function() {
        location.href = "#/employment";
    }
    $scope.experiencenext = function() {
            location.href = "#/publication";
        }
        /*onclick of next and back call this funtion ends here*/
    $scope.experienceCancel = function() {
        swal({
                title: "Are you sure?",
                text: "If you cancel filled data will not be saved.",
                type: "warning",
                showCancelButton: true,
                confirmButtonColor: "#DD6B55",
                confirmButtonText: "Yes",
                cancelButtonText: "No",
                closeOnConfirm: false,
                closeOnCancel: false
            },
            function(isConfirm) {
                if (isConfirm) {
                    //implementation need to put
                    location.href = "update-user-profile";
                    swal("Cancelled!", "successfully");
                } else {
                    swal("Not Cancelled");
                }
            });
    }
}]);

/*##########################publication page#######################################*/
controllerModuleAPP.controller('publication-page-controller', ['$scope', 'userPersonalDetails', 'fundingUpload','fileUpload', '$http', '$compile', '$rootScope', 'componentService', 'dateConvert', 'highlightTableRowService', 'certificatUpload','NewCodeSetServiceJS','documentValidation', function($scope, userPersonalDetails,fundingUpload,fileUpload, $http, $compile, $rootScope, componentService, dateConvert, highlightTableRowService, certificatUpload,NewCodeSetServiceJS,documentValidation) {

    /**
     * for access control module code
     */

	
	 $scope.MyNewCodeSetServiceJS = NewCodeSetServiceJS;
	
 	$scope.disabledpublicationfield=false;
	$scope.selectedanswerdatayes=function(val)
	{
 		$scope.disabledpublicationfield=true;
 		$scope.publicationCancel();
 	}
 	$scope.selectedanswerdatano=function(val)
	{
 		$scope.disabledpublicationfield=false;
 	}
     var  URL = window.location.href;
    requestedUrl  =  URL.substring(URL.lastIndexOf('/')  +  1);
    URL = "/" + requestedUrl;
    componentService.getSessionDataInPage($scope, URL);
    $scope.$MyService = componentService;

    $scope.publicationId = 0;
    $scope.showorhideupdate = false;
    $scope.showorhideadd = true;
    $scope.hideFileNameLabel = true;
    $scope.genericMethod = function() {
        $http({
                method: 'GET',
                url: 'get-publication-page-data'
            })
            .success(function(data, status, headers, config) {
                $scope.uderDetails = data;
                $scope.publicationsTableInformation = data.publicationDetails.publicationsInformation;
                $('#publicationtable').bootstrapTable({
                    data: $scope.publicationsTableInformation
                });
                $('#publicationtable').bootstrapTable('load', $scope.publicationsTableInformation);
                userPersonalDetails.setData($scope.uderDetails);
                $scope.addBubbleDataForPublication($scope.publicationsTableInformation);
                //$scope.publicationDetailsData= userPersonalDetails.data;
                //$scope.publications=$scope.publicationDetailsData.publicationDetails;
                //$scope.publicationInfo=$scope.publications.publicationsInformation;
            })
            .error(function(data, status, headers, config) {

            });
    }

    $scope.colors = [
        "col-lg-2 col-md-2 col-sm-2 bubble-box bg-aqua",
        "col-lg-2 col-md-2 col-sm-2 bubble-box bg-green",
        "col-lg-2 col-md-2 col-sm-2 bubble-box bg-yellow",
        "col-lg-2 col-md-2 col-sm-2 bubble-box bg-red",
        "col-lg-2 col-md-2 col-sm-2 bubble-box bg-aqua",
        "col-lg-2 col-md-2 col-sm-2 bubble-box bg-green",
        "col-lg-2 col-md-2 col-sm-2 bubble-box bg-yellow",
        "col-lg-2 col-md-2 col-sm-2 bubble-box bg-red",
        "col-lg-2 col-md-2 col-sm-2 bubble-box bg-aqua",
        "col-lg-2 col-md-2 col-sm-2 bubble-box bg-green",
        "col-lg-2 col-md-2 col-sm-2 bubble-box bg-yellow",
        "col-lg-2 col-md-2 col-sm-2 bubble-box bg-red",
        "col-lg-2 col-md-2 col-sm-2 bubble-box bg-aqua",
        "col-lg-2 col-md-2 col-sm-2 bubble-box bg-green",
        "col-lg-2 col-md-2 col-sm-2 bubble-box bg-yellow",
        "col-lg-2 col-md-2 col-sm-2 bubble-box bg-red",
        "col-lg-2 col-md-2 col-sm-2 bubble-box bg-aqua",
        "col-lg-2 col-md-2 col-sm-2 bubble-box bg-green",
        "col-lg-2 col-md-2 col-sm-2 bubble-box bg-yellow",
        "col-lg-2 col-md-2 col-sm-2 bubble-box bg-red"
    ];
    $scope.addBubbleDataForPublication = function(data) {
        $("#publicationBubble").empty();
        var j = 0;
        for (i in data) {
            j++;
            console.log(data);
            $scope.modelDataPublication = data[i];
            var tempValuePublication = "tempValuePublication" + i;
            $scope.tempVal = "tempValuePublication" + i
            $scope[tempValuePublication] = data[i];
            var inputbox = "<div class='col-md-3 col-sm-6 col-xs-12 bubblesboxw'> <div class='info-box'> <span class='info-box-icon bg-aqua'><p class='fa fa-fw fa-sun-o iconcenter'></p><p class='iconcentertextnum'>" + (j) + "</p></span> <div class='info-box-content'> <span class='info-box-number'>" + $scope.modelDataPublication.publication_type_shortDesc + "</span> <span class='info-box-text'>" + $scope.modelDataPublication.authors + "</span> <span class='info-box-text'>" + $scope.modelDataPublication.publishedYear + "</span><a ng-click='fillDataIntoFormPublication(" + $scope.tempVal + ")' class='small-box-footer moreinfomit' title='More info'><i class='fa fa-arrow-circle-right'></i></a> </div></div> </div>";

            /* var inputbox="<div class='"+$scope.colors[i]+"'><div class='inner'><p>Publication Type	: "+$scope.modelDataPublication.publication_type_shortDesc+"</p><p>Authors: "+$scope.modelDataPublication.authors+"</p><p>Year of Publication : "+$scope.modelDataPublication.publishedYear+"</p>"+
				"<div class='icon'><i class='ion ion-bag'></i></div> <a ng-click='fillDataIntoFormPublication("+$scope.tempVal+")' class='small-box-footer'>More info <i class='fa fa-arrow-circle-right'></i></a></div></div>";
		*/
            $("#publicationBubble").append(inputbox);

        }
        $compile($('#publicationBubble'))($scope);
    }
    $scope.fillDataIntoFormPublication = function(row) {
        $.confirm({
            title: mesaages.areusure,
            content_box: mesaages.editmsg,
            confirm: function() {
                $scope.selected = row;
                $scope.showorhideupdate = true;
                $scope.showorhidecancelupdate = true;
                $scope.showorhideadd = false;
                $scope.publication_type = $scope.selected.publication_type;
                $scope.publication_journel = $scope.selected.publication_journel;
                $scope.publishedYear = $scope.selected.publishedYear;
                $scope.publication_title =  $scope.selected.Publication_title;
                $scope.publication_description = $scope.selected.Publication_description;
                $scope.publication_details =  $scope.selected.Publication_details;
                $scope.publication_url =$scope.selected.Publication_url;
                $scope.publi_resource = $scope.selected.Publication_resource;
                $scope.publi_shortDetails = $scope.selected.shortDetails;
                $scope.publi_identifiers = $scope.selected.identifiers;
                $scope.publi_db = $scope.selected.publicationdb;
                $scope.publi_entrezUID = $scope.selected.publicationentrezUID;
                $scope.publi_properties = $scope.selected.publicationproperties;
                //$scope.publishedYear = new Date($scope.selected.publishedYear);	        				 
                $scope.authors = $scope.selected.authors;
                $scope.issn = $scope.selected.issn;
                if ($scope.selected.mrc_approved_project == "Yes") {
                    $scope.protocolShoworHide = false;
                } else if ($scope.selected.mrc_approved_project == "No") {
                    $scope.protocolShoworHide = true;
                }
                if ($scope.selected.mrc_approved_project == "Others") {
                    $scope.requiredornot = false;
                    $scope.protocolShoworHide = true;
                } else {
                    $scope.requiredornot = true;
                    $scope.protocolShoworHide = false;
                }
                $scope.mrc_approved_project = $scope.selected.mrc_approved_project;
                $scope.existingPubicationFile = $scope.selected.publication_file_name_no_url;
                $scope.publication_file_name_no_url = $scope.selected.publication_file_name_no_url;
                $scope.protocol_id = $scope.selected.protocol_id;
                $scope.publicationId = $scope.selected.publication_id;
                $scope.hideFileNameLabel = false;
                
                $scope.publicationexcelupload = true;
                
                $scope.project_funded_by = $scope.selected.project_funded_by;
                $scope.checkFundingOrganzationValue($scope.project_funded_by);
                $scope.other_organization = $scope.selected.other_organization;
                $scope.$apply()
                $(".back-to-top").trigger("click");
            }
        });

    }

    $scope.genericMethod();
    var dataObjForOrganization = {
        codeSet: 'ORGANIZATION'
    };
    var dataObjForCourse = {
        codeSet: 'PUBLICATION_TYPE'
    };
    var dataObjForStatus = {
        codeSet: 'STATUS'
    };
   /* var res = $http.post('getCodeSetByCodeSetType', dataObjForCourse);
    res.success(function(data, status, headers, config) {
        $scope.publicationType = data.codeSetsEntity;

    });
    res.error(function(data, status, headers, config) {
        notif({
        	  type: "error",
        	  msg: mesaages.error,
        	  position: "center",
        	  timeout: 5000
        	});

    });*/
     NewCodeSetServiceJS.getAllCodeSetsByType(dataObjForCourse)
    .then(function (data) {
     $scope.publicationType = data.codeSetsEntity;
     },
    function (errorMessage) {
     });
     
     // get FUNDING ORGANISATION
    $scope.getFundingOrganizations = function() {
        var dataObjForCourse = {
            orgType: 'ORGN_TYPE_41'
        };
        var res = $http.post('get-org-by-orgtype', dataObjForCourse);
        res.success(function(data, status, headers, config) {
            $scope.fundingOrg = [];
            var a = {
                codeSet: "Others",
                shortDesc: "Others"
            };
            $scope.fundingOrg = data;
            $scope.fundingOrg.push(a);
        });
        res.error(function(data, status, headers, config) {});
    }
    $scope.getFundingOrganizations();
    $scope.showOtherOrganization = false;
    $scope.checkFundingOrganzationValue = function(val) {
        if (val == 'Others') {
            $scope.showOtherOrganization = true;
        } else {
            $scope.other_organization = '';
            $scope.showOtherOrganization = false;
        }
    }

    //loading the Project Managed By of organization type to Project Managed By dropdown
    var orgTypeData = {
        orgType: "ORGN_TYPE_61"
    };
    var orgDataList = $http.post('get-org-by-orgtype', orgTypeData);
    orgDataList.success(function(data, status, headers, config) {
        $scope.projectManagedBy = data;
        var a = {
            codeSet: "Others",
            shortDesc: "Others"
        };
        $scope.projectManagedBy.push(a);
    })
    orgDataList.error(function(data, status, headers, config) {});


    $scope.file = 'file.doc';
    //get the list of organisations
    $http({
            method: 'GET',
            url: 'get-org-list'
        })
        .success(function(data, status, headers, config) {
            $scope.orgList = data;
        })
        .error(function(data, status, headers, config) {
            $scope.error = true;
        });
    /* $scope.mrcApprovedProject=[
                                {
                                	mrc_approved_project:'Yes'
                                },
                                {
                                	mrc_approved_project:'No'
                                }
                                ];*/
    //$scope.mrc_approved_project="No";
    $scope.getPublication = function(isapprovedProgect) {
        if (isapprovedProgect == "yes") {
            $scope.readorwrite = false;
        } else {
            $scope.readorwrite = true;
            //$("#protocol").prop("disable",true);
        }
    }
    $scope.protocolShoworHide = true;
    $scope.enableProtocolID = function() {

        $scope.protocolShoworHide = false;
        $scope.requiredornot = true;
    }
    $scope.disableProtocolID = function() {
        $scope.protocol_id = '';
        $scope.protocolShoworHide = true;
        $scope.requiredornot = false;

    }
    $scope.changedProjectManagedBy = function() {
            if ($scope.mrc_approved_project == 'Others' || $scope.mrc_approved_project == '' || $scope.mrc_approved_project == undefined) {
                $scope.protocol_id = '';
                $scope.protocolShoworHide = true;
                $scope.requiredornot = false;
                $('#HACView_publication_protocol_id_txt').find('span').each(function()
                 {
                	if ($(this).attr('class') == 'requiredfiled')
                    {
                		$(this).removeClass('requiredfiled');
    	                $(this).addClass('isMandatory');
                    }
                 });
                
            } else {
                $scope.protocolShoworHide = false;
                $scope.requiredornot = true;
                $('#HACView_publication_protocol_id_txt').find('span').each(function()
                    {
                	if ($(this).attr('class') == 'isMandatory')
                    {
                		$(this).removeClass('isMandatory');
                       	$(this).addClass('requiredfiled');
                    }
                       	
                    });
            }

        }
        //sss

    $scope.checkProtocolId = function() {
            for (var i = 0; i < $scope.protocol_id_check.length; i++) {
                if ($scope.protocol_id == $scope.protocol_id_check[i]) {
                    $scope.validProtocol_id = $scope.protocol_id_check[i];
                }
            }
            var dataResearchId = {
            		protocolId: $scope.protocol_id,
            };
            var res = $http.post('get-research-application-byProtocolId', dataResearchId);

            res.success(function(data, status, headers,
                config) {
                if (data == undefined || data == "" || data.length == 0) {
                    $scope.projectTileforresearch = "";
                } else {
                    $('#HACView_publication_protocol_id_title').show();
                    $scope.projectTileforresearch ="<b>Project Title : </b>"+ data.projectTitle;
                }


            });
            res.error(function(data, status, headers,
                config) {});
            if ($scope.projectTileforresearch == "") {
                $('#HACView_publication_protocol_id_title').hide();
            }
        }
        /* $scope.getProtocolIDPublication=function()
        	{
        		 var res = $http.get('get-protocol-id');
        	      res.success(function(data, status, headers, config) {
        	    	  $scope.protocol_id_check=data;
        	      });
        	      res.error(function(data, status, headers, config) {
        	      });    
        		
        	}
        	$scope.getProtocolIDPublication();*/

    $scope.getProtocolIDPublication = function() {
        var res = $http.get('get-all-protocol-id');
        res.success(function(data, status, headers, config) {
            $scope.protocol_id_check = data;
        });
        res.error(function(data, status, headers, config) {});

    }
    $scope.getProtocolIDPublication();

    //Checking if a given file name has an extension
    function hasExtension(fileName, exts) {
        return (new RegExp('(' + exts.join('|').replace(/\./g, '\\.') + ')$')).test(fileName);
    }
    $scope.uploadFileForCodeSet = function(){
	      var file = $scope.doc_file_mc_codset_publication;
	      var type = file.type;
          var size = file.size + "";
          var fileName=file.name;
//          var ext = fileName.substring(fileName.lastIndexOf('.') + 1).toLowerCase();
          if(hasExtension(fileName,['.xls','.xlsx'])){
        	  if(type=="application/vnd.ms-excel" || type=="application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"){
            	  //certificatUpload.uploadFileToUrl(file, uploadUrl,$scope);
        	      var fd = new FormData();
        	        fd.append('file', file);

        	        var res = $http.post('master-orgn-type-publication', fd, {
        	                transformRequest: angular.identity,
        	                headers: {
        	                    'Content-Type': undefined
        	                }
        	            })
        	        res.success(function(data, status, headers, config) {
        	        	if(data.result=='success'){
         	        	   notif({
         	                    type: "success",
         	                    msg: mesaages.cert_upload_success,
         	                    multiline: true,
         	                    position: "center",
         	                    timeout: 6000,
         	                    append: false
         	                });
         	                angular.element("input[type='file']").val(null);
         	                $scope.certificationFile = '';
         	                $scope.genericMethod();
         	                $scope.success = true;
         	                $("#uploadFormModal").modal('hide');
         	                $scope.getListOfDownloadForms();
         	           } else if(data.result=='failure'){
        	        	   notif({
      	                      type: "error",
      	                      msg: mesaages.pub_made_sample_format_mismatch,
      	                      multiline: true,
      	                      position: "center",
      	                      timeout: 6000,
      	                      append: false
      	                  });
         	           }else if(data.result=='FORMAT_MISMATCH'){
        	        	   //thsi is failure case
        	        	   notif({
        	             	  type: "error",
        	             	  msg: data.sample_format_mis,
        	             	  position: "center",
        	             	  timeout: 6000
        	             	});
        	        	   //alert(data.result);
        	           }else{
        	        	   notif({
        	                      type: "error",
        	                      msg: 	messages1.publicationException ,
        	                      multiline: true,
        	                      position: "center",
        	                      timeout: 6000,
        	                      append: false
        	                  });
        	           }
        	        });
        	        res.error(function(data, status, headers, config) {
        	        	
        	        });
              }else if(type=="application/pdf" || type=="application/msword" || type=="application/vnd.openxmlformats-officedocument.wordprocessingml.document"){
            	  notif({
                      type: "error",
                      msg: 	mesaages.plz_upld_pubmade_file_supported_format_fail,
                      multiline: true,
                      position: "center",
                      timeout: 6000,
                      append: false
                  });
            	  
              }else{
            	  notif({
                      type: "error",
                      msg: 	mesaages.plz_upld_pubmade_file_supported_format_fail,
                      multiline: true,
                      position: "center",
                      timeout: 6000,
                      append: false
                  });
              }
    	
        	  
          }else{
        	  notif({
                  type: "error",
                  msg: 	mesaages.plz_upld_pubmade_file_supported_format_fail,
                  multiline: true,
                  position: "center",
                  timeout: 6000,
                  append: false
              });
          }
         /* var fileExt = sender.value;
          fileExt = fileExt.substring(fileExt.lastIndexOf('.'));*/
/*              */
	      };
    
	   
    window.actionEvents = {
        'click .edit': function(e, value, row, index) {
            $.confirm({
                title: mesaages.areusure,
                content_box: mesaages.editmsg,
                confirm: function() {
                    highlightTableRowService.highlightcolor(e);
                    $scope.selected = row;
                    $scope.showorhideupdate = true;
                    $scope.showorhidecancelupdate = true;
                    $scope.showorhideadd = false;
                    $scope.publication_type = $scope.selected.publication_type;
                    $scope.publication_journel = $scope.selected.publication_journel;
                    $scope.publishedYear = $scope.selected.publishedYear;
                    $scope.publication_title =  $scope.selected.Publication_title;
                    $scope.publication_description = $scope.selected.Publication_description;
                    $scope.publication_details =  $scope.selected.Publication_details;
                    $scope.publication_url =$scope.selected.Publication_url;
                    $scope.publi_resource = $scope.selected.Publication_resource;
                    $scope.publi_shortDetails = $scope.selected.shortDetails;
                    $scope.publi_identifiers = $scope.selected.identifiers;
                    $scope.publi_db = $scope.selected.publicationdb;
                    $scope.publi_entrezUID = $scope.selected.publicationentrezUID;
                    $scope.publi_properties = $scope.selected.publicationproperties;
                    //$scope.publishedYear = new Date($scope.selected.publishedYear);	        				 
                    $scope.authors = $scope.selected.authors;
                    $scope.issn = $scope.selected.issn;
                    $scope.changedProjectManagedBy();
                    $scope.mrc_approved_project = $scope.selected.mrc_approved_project;
                    $scope.existingPubicationFile = $scope.selected.publication_file_name_no_url;
                    $scope.publication_file_name_no_url = $scope.selected.publication_file_name_no_url;
                    $scope.disabledpublicationfield=false;
                    
                    $scope.selected_answer_data="";
                    
                    
                    if ($scope.mrc_approved_project == "Others") {
                        $scope.requiredornot = false;
                        $scope.protocolShoworHide = true;
                    } else {
                        $scope.requiredornot = true;
                        $scope.protocolShoworHide = false;
                    }
                    $scope.protocol_id = $scope.selected.protocol_id;
                    $scope.publicationId = $scope.selected.publication_id;
                    $scope.hideFileNameLabel = false;
                    
                    $scope.publicationexcelupload = true;
                    
                    $scope.project_funded_by = $scope.selected.project_funded_by;
                    $scope.checkFundingOrganzationValue($scope.project_funded_by);
                    $scope.other_organization = $scope.selected.other_organization;
                    $scope.$apply()
                    $(".back-to-top").trigger("click");
                }
            });
        },
        'click .remove': function(e, value, row, index) {
            $.confirm({
                title: mesaages.areusure,
                content_box: mesaages.deletemsg,
                confirm: function() {
                    $scope.selected = row;
                    // alert($scope.selected.publication_file_name);
                    var dataObj = {
                        publication_type: $scope.selected.publication_type,
                        publication_journel: $scope.selected.publication_journel,
                        publishedYear: dateConvert.convertDateToMiliSecondForProfile($scope.selected.publishedYear),
                        authors: $scope.selected.authors,
                        issn: $scope.selected.issn,
                        mrc_approved_project: $scope.selected.mrc_approved_project,
                        protocol_id: $scope.selected.protocol_id,
                        publication_id: $scope.selected.publication_id,
                        file_name: $scope.selected.publication_file_name,
                        is_deleted: true,
                        pageName: "publication"
                    };

                    var res = $http.post('update-user-profile-data', dataObj);
                    res.success(function(data, status, headers, config) {
                        $scope.message = data;
                        if ($scope.message == true) {
                            notif({
                                type: "success",
                                msg: messages1.publ_dtl_dlt_success,
                                multiline: true,
                                position: "center",
                                timeout: 6000
                            });

                            $scope.genericMethod();
                            $scope.showorhideupdate = false;
                            $scope.showorhidecancelupdate = false;
                            $scope.showorhideadd = true;
                            $scope.publication_type = '';
                            $scope.publication_journel = '';
                            $scope.publication_title='';
                            $scope.publication_description='';
                            $scope.publication_details='';
                            $scope.publication_url='';
                            $scope.publi_resource='';
                            $scope.publishedYear = '';
                            $scope.authors = '';
                            $scope.issn = '';
                            $scope.protocol_id = '';
                            $scope.mrc_approved_project = 'No';
                            angular.element("input[type='file']").val(null);
                            $scope.pub_file_name = '';
                            $scope.publicationFile = undefined;
                            $scope.publication.$setPristine(true);
                            angular.element("input[type='file']").val(null);
                            $scope.publicationCancel();
                        } else {
                            notif({
                                type: "error",
                                msg: messages1.publ_not_dlt_plz_cont_adm,
                                position: "center",
                                multiline: true,
                                timeout: 6000
                            });
                        }
                    });
                    res.error(function(data, status, headers, config) {
                        notif({
                            type: "error",
                            msg: messages1.somth_wrng_plz_cont_adm,
                            multiline: true,
                            position: "center",
                            timeout: 6000
                        });
                    });
                }
            });
        }
    };


    $scope.saveOrupdatePublication = function(form) {
        angular.forEach(form, function(obj) {
            if (angular.isObject(obj) && angular.isDefined(obj.$setDirty)) {
                obj.$setDirty();
            }
        })

        $scope.checkProtocolId();
        if (form.$valid) {
            var publicationYear = dateConvert.convertDateToMiliSecondForProfile($scope.publishedYear)
            var todayDate = checkForTodayDate();
            todayDate = dateConvert.convertDateToMiliSecondForProfile(todayDate)
            if (publicationYear > todayDate) {
                notif({
                    type: "warning",
                    msg: messages1.publicationSuccesssss,
                    multiline: true,
                    position: "center",
                    timeout: 6000
                });
                return false;
            }
            //sss

            if ($scope.mrc_approved_project != "Others") {
                $scope.protocolShoworHide = false;
                $scope.requiredornot = true;

                if ($scope.validProtocol_id == null || $scope.validProtocol_id == "" || $scope.validProtocol_id == undefined || $scope.validProtocol_id != $scope.protocol_id) {
                    notif({
                        type: "warning",
                        msg: messages1.protocolIdNotValid,
                        multiline: true,
                        position: "center",
                        timeout: 6000
                    });
                    return false;
                }
            } else {

                $scope.requiredornot = false;
            }

            // sss
            // upload file

            //alert(file);
           /* if ($scope.publicationId == 0) {
                if ($scope.publicationFile == undefined || $scope.publicationFile == "" || $scope.publicationFile == "No file") {
                    $scope.changedProjectManagedBy();
                    notif({
                        type: "warning",
                        msg: mesaages.plz_upld_publication_file,
                        multiline: true,
                        position: "center",
                        timeout: 6000
                    });
                    return false;
                }
            }
*/



            if ($scope.publicationFile != undefined && $scope.publicationFile != "" && $scope.publicationFile != "No file") {
                var file = $scope.publicationFile;
                $scope.fileName = file.name;
                var type1 = file.type;
                $scope.isSpecialChar= documentValidation.checkForSpecialChar(file);
                if($scope.isSpecialChar==false){
              		 notif({
       					type : "warning",
       					msg : messageDefault.fileSpecChar,
       					position : "center",
       					multiline: true,
       					timeout : 6000,
       					autohide: true
       				});
       			 return false;
                   }
                $scope.isDocName= documentValidation.checkForDocumentNameLenght(file);
                if($scope.isDocName==false){
                	notif({
    					type : "warning",
    					msg : messageDefault.fileLength,
    					position : "center",
    					multiline: true,
    					timeout : 6000,
    					autohide: true
    				});
       			 return false;
                   }
                if (type1 == "application/vnd.openxmlformats-officedocument.wordprocessingml.document" || type1 == "application/msword" || type1 == "application/pdf" || type1 == "application/vnd.ms-excel" || type1 == "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" || type1 == "image/jpeg" || type1 == "image/png") {

                    var dataObj = {
                        publication_type: $scope.publication_type,
                        publication_journel: $scope.publication_journel,
                        publishedYear: publicationYear,
                        authors: $scope.authors,
                        issn: $scope.issn,
                        mrc_approved_project: $scope.mrc_approved_project,
                        protocol_id: $scope.protocol_id,
                        publication_id: $scope.publicationId,
                        publi_resource:$scope.publi_resource,
                        publication_url:$scope.publication_url,
                        publication_details:$scope.publication_details,
                        publication_description:$scope.publication_description,
                        publication_title:$scope.publication_title,
                        is_deleted: false,
                        file_name: $scope.fileName,
                        project_funded_by: $scope.project_funded_by,
                        other_organization: $scope.other_organization,
                        publication_ShortDetails:$scope.publi_shortDetails,
                        publication_Identifiers:$scope.publi_identifiers,
                        publicationdb:$scope.publi_db,
                        publicationentrezuid:$scope.publi_entrezUID,
                        Properties:$scope.publi_properties,
                        pageName: "publication"
                    };
                } else {
                    notif({
                        type: "warning",
                        msg: mesaages.plz_slt_doc_size,
                        multiline: true,
                        position: "center",
                        timeout: 6000
                    });
                    $scope.changedProjectManagedBy();
                    return false;
                }


            } else {
                $scope.withoutPublicationFileUpdate = "yes";
                var dataObj = {
                    publication_type: $scope.publication_type,
                    publication_journel: $scope.publication_journel,
                    publishedYear: publicationYear,
                    authors: $scope.authors,
                    issn: $scope.issn,
                    mrc_approved_project: $scope.mrc_approved_project,
                    protocol_id: $scope.protocol_id,
                    publication_id: $scope.publicationId,
                    publi_resource:$scope.publi_resource,
                    publication_url:$scope.publication_url,
                    publication_details:$scope.publication_details,
                    publication_description:$scope.publication_description,
                    publication_title:$scope.publication_title,
                    project_funded_by: $scope.project_funded_by,
                    other_organization: $scope.other_organization,
                    publication_ShortDetails:$scope.publi_shortDetails,
                    publication_Identifiers:$scope.publi_identifiers,
                    publicationdb:$scope.publi_db,
                    publicationentrezuid:$scope.publi_entrezUID,
					Properties:$scope.publi_properties,
                    is_deleted: false,
                    file_name: "",
                    pageName: "publication"
                };

            }

            var res = $http.post('update-user-profile-data', dataObj);
            res.success(function(data, status, headers, config) {
                $scope.message = data;

                if ($scope.publication_journel == undefined || $scope.publication_journel.match(/^\s*$/) || $scope.publication_journel == null || $scope.publication_journel == "") {
                    notif({
                        type: "error",
                        msg: "Please fill Published Journal",
                        position: "center",
                        multiline: true,
                        timeout: 6000
                    });
                    return false;
                }


                if ($scope.authors == undefined || $scope.authors.match(/^\s*$/) || $scope.authors == null || $scope.authors == "") {
                    notif({
                        type: "error",
                        msg: "Please fill Authors",
                        position: "center",
                        multiline: true,
                        timeout: 6000
                    });
                    return false;
                }
                if ($scope.message == true) {

                    if ($scope.withoutPublicationFileUpdate == "yes") {
                        notif({
                            type: "success",
                            msg: messages1.publicationSuccess,
                            multiline: true,
                            position: "center",
                            timeout: 6000
                        });
                    }

                    /*notif({
		 						  type: "success",
		 						  msg: messages1.publicationSuccess,
		 						  multiline:true,
		 						  position: "center",
		 						  timeout: 6000
		 						});*/

                    var uploadUrl = "upload-file-publication";
                    if (file != undefined && file != "" && file != "No file") {
                    	 $scope.isSpecialChar= documentValidation.checkForSpecialChar(file);
                    	 if($scope.isSpecialChar==false){
                       		 notif({
                					type : "warning",
                					msg : messageDefault.fileSpecChar,
                					position : "center",
                					multiline: true,
                					timeout : 6000,
                					autohide: true
                				});
                			 return false;
                            }
                    	 $scope.isDocName= documentValidation.checkForDocumentNameLenght(file);
                    	 if($scope.isDocName==false){
                         	notif({
             					type : "warning",
             					msg : messageDefault.fileLength,
             					position : "center",
             					multiline: true,
             					timeout : 6000,
             					autohide: true
             				});
                			 return false;
                            }
                        var type = file.type;
                        if (type == "application/vnd.openxmlformats-officedocument.wordprocessingml.document" || type == "application/msword" || type == "application/pdf" || type == "application/vnd.ms-excel" || type == "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" || type == "image/jpeg" || type == "image/png") {
                            certificatUpload.uploadFileToUrl(file, uploadUrl, $scope);

                        }

                    }


                    $scope.publicationCancel();
                    $scope.genericMethod();
                    $scope.showorhideupdate = false;
                    $scope.showorhidecancelupdate = false;
                    $scope.showorhideadd = true;
                    $scope.publication_type = '';
                    $scope.publication_journel = '';
                    $scope.publication_title='';
                    $scope.publication_description='';
                    $scope.publication_details='';
                    $scope.publication_url='';
                    $scope.publi_resource='';
                    $scope.publishedYear = '';
                    $scope.publi_shortDetails = '',
                    $scope.publi_identifiers = '',
                    $scope.publi_db = '',
                    $scope.publi_entrezUID = '',
                    $scope.publi_properties = '',
                    $scope.authors = '';
                    $scope.issn = '';
                    $scope.protocol_id = '';
                    $scope.mrc_approved_project = '';
                    $scope.project_funded_by = '';
                    $scope.other_organization = '';
                    angular.element("input[type='file']").val(null);
                    $scope.pub_file_name = '';
                    $scope.publicationFile = undefined;
                    $scope.publication.$setPristine(true);
                    /*$scope.publication.$setPristine(true);
                    $scope.publication.$setPristine(true);
                    $scope.publication.$setPristine(true);
                    $scope.publication.$setPristine(true);
                    $scope.publication.$setPristine(true);*/

                } else {
                    notif({
                        type: "error",
                        msg: messages1.publicationError,
                        multiline: true,
                        position: "center",
                        timeout: 6000
                    });
                }
            });
            res.error(function(data, status, headers, config) {
                notif({
                    type: "error",
                    msg: messages1.publicationException,
                    multiline: true,
                    position: "center",
                    timeout: 6000
                });
            });
        } else {
            notif({
                type: "warning",
                msg: messages1.publicationFilledValidations,
                multiline: true,
                position: "center",
                timeout: 6000
            });
        }

    }

    function checkForTodayDate() {
        var today = new Date();
        var dd = today.getDate();
        var mm = today.getMonth() + 1; //January is 0!

        var yyyy = today.getFullYear();
        if (dd < 10) {
            dd = '0' + dd
        }
        if (mm < 10) {
            mm = '0' + mm
        }
        var today = dd + '/' + mm + '/' + yyyy;
        return today;
    }


    $scope.publicationCancel = function() {
        highlightTableRowService.removeHighlight();
        $scope.showorhideupdate = false;
        $scope.showorhidecancelupdate = false;
        $scope.showorhideadd = true;
        $scope.publicationexcelupload = false;
        $scope.publication_type = '',
            $scope.publication_journel = '',
            $scope.publishedYear = '',
            $scope.publi_shortDetails = '',
            $scope.publi_identifiers = '',
            $scope.publi_db = '',
            $scope.publi_entrezUID = '',
            $scope.publi_properties = '',
            $scope.publication_title='';
            $scope.publication_description='';
            $scope.publication_details='';
            $scope.publication_url='';
            $scope.publi_resource='';
            $scope.authors = '',
            $scope.issn = '',
            $scope.protocol_id = '',
            $scope.publicationId = 0;
        $scope.fileName = undefined;
        $scope.showorhide = false;
        $scope.addshoworhide = true;
        $scope.mrc_approved_project = '';
        $scope.project_funded_by = '';
        $scope.other_organization = '';
        $scope.showOtherOrganization = false;
        $scope.hideFileNameLabel = true;
        $scope.withoutPublicationFileUpdate = '';
        $scope.existingPubicationFile = undefined;
        angular.element("input[type='file']").val(null);
        $scope.pub_file_name = '';
        $scope.publicationFile = undefined;
        $scope.publication.$setPristine(true);
        $scope.genericMethod();
    }

}]);
/***************angular js controller for main page ***************************/
controllerModuleAPP.controller('third-party-user-profile-controller', ['$scope', 'userPersonalDetails', '$http', '$rootScope', 'highlightTableRowService', '$compile','NewCodeSetServiceJS', function($scope, userPersonalDetails, $http, $rootScope, highlightTableRowService, $compile,NewCodeSetServiceJS) {
  
	
	$scope.MyNewCodeSetServiceJS = NewCodeSetServiceJS;
	$scope.showorhideadd = true;
    $scope.showorhideupdate = false;
    $scope.tpId = 0;
    $scope.isUpdateTP = false;
    $scope.thirdPartyIdData = [];
    $scope.thirdPartyMain = "";
    $scope.thirdPartyId = "";
    $scope.tpId = 0;
    $scope.tpUrl = "";

    // get the third party data
    $scope.getThirdPartyPageData = function() {
        //thirdPartyUserProfileTable
        var res = $http.get('get-third-party-user-page-data');
        res.success(function(data, status, headers, config) {
            $scope.thirdPartyPageData = data;
            $('#thirdPartyUserProfileTable').bootstrapTable({
                data: $scope.thirdPartyPageData
            });
            $('#thirdPartyUserProfileTable').bootstrapTable('load', $scope.thirdPartyPageData);
            $scope.addBubbleForThirdParty($scope.thirdPartyPageData);
        });
        res.error(function(data, status, headers, config) {

        });
    }
    $scope.getThirdPartyPageData();

    // display bubble for third party
    $scope.addBubbleForThirdParty = function(data) {
        $("#thirdPartyBubbleDiv").empty();
        var j = 0;
        for (i in data) {
            j++;
            var tempThirdParty = "tempThirdParty" + i;
            $scope.tempThirdPartyVar = "tempThirdParty" + i;
            $scope.thirdPartyData = data[i];
            $scope[tempThirdParty] = data[i];
            var inputbox = "<div class='col-md-3 col-sm-6 col-xs-12 bubblesboxw'> <div class='info-box'> <span class='info-box-icon bg-aqua'><p class='fa fa-fw fa-sun-o iconcenter'></p><p class='iconcentertextnum'>" + (j) + "</p></span> <div class='info-box-content'><span class='info-box-text'>" + $scope.thirdPartyData.thirdParty + "</span><span class='info-box-text'><a href='" + $scope.thirdPartyData.url + "' target='_blank'>" + "View" + "</a></span></div><div class='info-box-content'><span><a ng-click='fillDataIntoFormThirdParty(" + $scope.tempThirdPartyVar + ")' class='small-box-footer moreinfomit' title='More info'><i class='fa fa-arrow-circle-right'></i></a></span> </div></div> </div>";
            $("#thirdPartyBubbleDiv").append(inputbox);

        }
        $compile($('#thirdPartyBubbleDiv'))($scope);

    }
    $scope.fillDataIntoFormThirdParty = function(row) {
        $.confirm({
            title: mesaages.areusure,
            content_box: mesaages.editmsg,
            confirm: function() {
                $scope.selected = row;
                $scope.selected = row;
                $scope.showorhideupdate = true;
                $scope.showorhidecancelupdate = true;
                $scope.showorhideadd = false;
                $scope.thirdPartyMain = $scope.selected.thirdParty;
                $scope.thirdPartytitle=$scope.selected.thirdParty;
                $scope.thirdPartyId = $scope.selected.thirdPartyId;
                $scope.thirdPartyMaintExtra = $scope.selected.thirdParty;
                $scope.thirdPartyIdExtra = $scope.selected.thirdPartyId;
                $scope.tpId = $scope.selected.tpId;
                $scope.isUpdateTP = true;
                $scope.$apply()
                $(".back-to-top").trigger("click");
            }
        });
    }

    // get the value for dropdown
    var dataObjForSelectBox = {
        codeSet: 'THIRD_PARTY_ID'
    };
   /* var res = $http.post('getCodeSetByCodeSetType', dataObjForSelectBox);
    res.success(function(data, status, headers, config) {
        $scope.thirdPartyIdData = data.codeSetsEntity;
    });
    res.error(function(data, status, headers, config) {


    });*/
    
    NewCodeSetServiceJS.getAllCodeSetsByType(dataObjForSelectBox)
    .then(function (data) {
     $scope.thirdPartyIdData = data.codeSetsEntity;
     },
    function (errorMessage) {
     });
    
    
     // add and update the third party record in table
    $scope.tempUrl = "";
    $scope.saveThirdPartyData = function(form) {
        angular.forEach(form, function(obj) {
            if (angular.isObject(obj) && angular.isDefined(obj.$setDirty)) {
                obj.$setDirty();
            }
        })
        if (form.$valid) {
            $scope.idDuplicate = false;
            if ($scope.thirdPartyPageData != undefined) {
                for (var i = 0; i < $scope.thirdPartyPageData.length; i++) {
                    if ($scope.tpId == 0) {
                        $scope.thirdPartyMainTemp = $scope.thirdPartyPageData[i].thirdParty;
                        $scope.thirdPartyIdTemp = $scope.thirdPartyPageData[i].thirdPartyId;
                        if ($scope.thirdPartyMain == $scope.thirdPartyMainTemp && $scope.thirdPartyIdTemp == $scope.thirdPartyId) {
                            $scope.idDuplicate = true;
                        }
                    } else {
                        if ($scope.thirdPartyIdExtra == $scope.thirdPartyId) {
                            $scope.idDuplicate = false;
                        } else {
                            $scope.thirdPartyMainTemp = $scope.thirdPartyPageData[i].thirdParty;
                            $scope.thirdPartyIdTemp = $scope.thirdPartyPageData[i].thirdPartyId;
                            if ($scope.thirdPartyMain == $scope.thirdPartyMainTemp && $scope.thirdPartyIdTemp == $scope.thirdPartyId) {
                                $scope.idDuplicate = true;
                            }
                        }
                    }

                }
            }
            if ($scope.idDuplicate) {
                notif({
                    type: "warning",
                    msg: messages.thirdPartyValidations,
                    multiline: true,
                    position: "center",
                    timeout: 6000
                });
                return false;
            }
            for (var i = 0; i < $scope.thirdPartyIdData.length; i++) {
                if ($scope.thirdPartyMain == $scope.thirdPartyIdData[i].codeSet) {
                    $scope.tempUrl = $scope.thirdPartyIdData[i].longDesc
                }
            }
            $scope.tpUrl = $scope.tempUrl + $scope.thirdPartyId;
            var dataObjForSelectBox = {
                thirdParty: $scope.thirdPartyMain,
                thirdPartyId: $scope.thirdPartyId,
                tpId: $scope.tpId,
                url: $scope.tpUrl
            };
            var res = $http.post('add-third-party-page-data', dataObjForSelectBox);
            res.success(function(data, status, headers, config) {
                if (data) {
                    notif({
                        type: "success",
                        msg: messages.thirdPartyAdd,
                        multiline: true,
                        position: "center",
                        timeout: 6000
                    });
                    $scope.getThirdPartyPageData();
                    $scope.thirdPartyMain = "";
                    $scope.thirdPartyId = "";
                    $scope.tpId = 0;
                    $scope.tpUrl = "";
                    $scope.isUpdateTP = false;
                    $scope.showorhideupdate = false;
                    $scope.showorhidecancelupdate = false;
                    $scope.showorhideadd = true;
                    $scope.userThirdPartyForm.$setPristine(true);
                }
            });
            res.error(function(data, status, headers, config) {


            });
        }else {
            notif({
                type: "warning",
                msg: messages.kindlyfilldata,
                multiline: true,
                position: "center",
                timeout: 6000
            });
            $scope.isDisabled = false;
        }
    }

    // edit record
    window.thirdPartyActionEvents = {
        'click .edit': function(e, value, row, index) {
            $.confirm({
                title: mesaages.areusure,
                content_box: mesaages.editmsg,
                confirm: function() {
                    highlightTableRowService.highlightcolor(e);
                    $scope.selected = row;
                    $scope.showorhideupdate = true;
                    $scope.showorhidecancelupdate = true;
                    $scope.showorhideadd = false;
                    $scope.thirdPartyMain = $scope.selected.thirdParty;
                    $scope.thirdPartyId = $scope.selected.thirdPartyId;
                    $scope.thirdPartyMaintExtra = $scope.selected.thirdParty;
                    $scope.thirdPartyIdExtra = $scope.selected.thirdPartyId;
                    $scope.tpId = $scope.selected.tpId;
                    $scope.isUpdateTP = true;
                    $scope.$apply();
                    $(".back-to-top").trigger("click");
                }
            });
        },

        'click .remove': function(e, value, row, index) {
            $.confirm({
                title: mesaages.areusure,
                content_box: mesaages.deleterecord,
                confirm: function() {

                    $scope.selected = row;
                    $scope.tpId = $scope.selected.tpId;
                    var dataObj = {
                        tpId: $scope.tpId
                    };

                    var res = $http.post('delete-user-third-party', dataObj);
                    res.success(function(data, status, headers, config) {
                        $scope.message = data;
                        if ($scope.message == true) {
                            notif({
                                type: "success",
                                msg: messages.thirdPartyDelete,
                                multiline: true,
                                position: "center",
                                timeout: 6000
                            });
                            $scope.thirdPartyMain = "";
                            $scope.thirdPartyId = "";
                            $scope.tpId = 0;
                            $scope.tpUrl = "";
                            $scope.isUpdateTP = false;
                            $scope.showorhideupdate = false;
                            $scope.showorhidecancelupdate = false;
                            $scope.showorhideadd = true;
                            $scope.userThirdPartyForm.$setPristine(true);
                            $scope.getThirdPartyPageData();
                        }
                    });
                    res.error(function(data, status, headers, config) {

                    });
                }
            });
        }
    };
    
    // reset for third party
    $scope.thirdPartyCancel=function(){
    	 $scope.thirdPartyMain = "";
         $scope.thirdPartyId = "";
         $scope.tpId = 0;
         $scope.tpUrl = "";
         $scope.isUpdateTP = false;
         $scope.showorhideupdate = false;
         $scope.showorhidecancelupdate = false;
         $scope.showorhideadd = true;
         $scope.userThirdPartyForm.$setPristine(true);
    }

}]);

//adding update icon to table
function actionFormatter(value) {
        return [
            '<a class="edit btn btn-yellow btn-sm mit-yellow-btn" style="padding: 4px;margin: 3px;padding-right: 1px;"  title="Update Item"><i class="glyphicon glyphicon-edit"></i></a><a class="remove btn btn-red btn-sm mit-red-btn" style="padding: 4px;margin: 3px;padding-right: 1px;"  title="Delete Item"><i class="glyphicon glyphicon-trash"></i></a>',

        ].join('   ');
    }
    //adding update icon to table
function thirdPartyActionFormatter(value) {
    return [
        '<a class="edit btn btn-yellow btn-sm mit-yellow-btn" style="padding: 4px;margin: 3px;padding-right: 1px;"  title="Update Item"><i class="glyphicon glyphicon-edit"></i></a><a class="remove btn btn-red btn-sm mit-red-btn" style="padding: 4px;margin: 3px;padding-right: 1px;"  title="Delete Item"><i class="glyphicon glyphicon-trash"></i></a>',

    ].join('   ');
}