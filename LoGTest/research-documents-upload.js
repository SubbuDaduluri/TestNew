var controllerModuleAPP = angular.module('controllersModule');
controllerModuleAPP.service('documentsUpload', ['$http', function ($http) {
	   this.uploadFileToUrl = function(file, uploadUrl,$scope,documentType){
	      var fd = new FormData();
	      for (var i = 0 ; i < file.length ; i ++){
	    	   fd.append('file[]', file[i]);
	    	}
	    // fd.append('file', file[0]);
	      fd.append('doc_type',documentType);
	     var result= $http.post(uploadUrl, fd, {
	         transformRequest: angular.identity,
	         headers: {'Content-Type': undefined}
	      })
	   
	      .success(function(data, status, headers, config){
			if(data == true){
				 $scope.genericMethod();
				 $scope.clear();
				
			}
	      })
	   
	      .error(function(data, status, headers, config){
	    	  notif({
				  type: "error",
				  msg: messages.resDocUploadFail,
				  position: "center",
				  multiline: true,
				   timeout: 6000
				});
	    	  $scope.genericMethod();
	      });
	     return result;
	   }
	}]);

controllerModuleAPP.controller('research-documents-page-controller', [ '$scope','$http', '$compile','$rootScope','documentsUpload','completionCheckService','researchBanner','componentService','highlightTableRowService','$window','clarificationService','userService','$q','NewCodeSetServiceJS','errorWarningService','documentValidation','ResearchApplicationModalService','$timeout', function($scope, $http, $compile,$rootScope,documentsUpload,completionCheckService,researchBanner,componentService,highlightTableRowService,$window,clarificationService,userService,$q,NewCodeSetServiceJS,errorWarningService,documentValidation,ResearchApplicationModalService,$timeout) {
	/*var thArray = [];

	$('#documentation > thead > tr > th').each(function(){
	    thArray.push($(this).text());
	})
	alert(thArray[0]);
	var a=thArray[0];*/
	//a.prop('ng-hide'.true);
 	$scope.MyNewCodeSetServiceJS = NewCodeSetServiceJS;
 	$rootScope.isCaseReportUI = sessionStorage.getItem("caseReportApplication");
 	 var isMemoSubmission=sessionStorage.getItem("memoSubmissionApplication");  
 	 $scope.workItemSubCodeTemp=sessionStorage.getItem("workItemSubCode");
 	 $scope.tempreadOnly = sessionStorage.getItem('isReadOnlyMode');
	//Banner code
 	$scope.isDocumentHistoryModal=false;
	$scope.showTableActionFormatter=false;
	var id = parseInt(sessionStorage.getItem("resAppId"));
    $rootScope.researchApplicationId = id;
    //Banner code
    $scope.getBannerDataFromService = function() {
        researchBanner.getBannerData($rootScope.researchApplicationId);
    }
	 $scope.$userlookUp=userService;
	 $scope.dataInsertedByWorkFlow=[];
	$scope.getBannerDataFromService();//to display banner on page refresh
	//Banner code ends
	 var researchId=sessionStorage.getItem("resAppId");
	 $scope.isAmendmendMode=sessionStorage.getItem("amendmendSubmissionApplication");
	//Code to check mandatory documents for research
	$scope.checkMandatoryDocsForResearch=function(){
		var resarchAppId_FMC=parseInt(sessionStorage.getItem("resAppId"));
		if(resarchAppId_FMC!=null && resarchAppId_FMC!=undefined){
			var manDocsRes = $http.post('check-mandatory-docs-for-research?res_app_id_FMD='+resarchAppId_FMC+'');
			manDocsRes.success(function(data, status, headers, config) {
				$scope.dataInsertedByWorkFlow=[];
				if(data!=null){
					$scope.dataInsertedByWorkFlow=data;
				}
				$scope.checkForErrorInApplication();
				$scope.genericMethod();
			 });
			manDocsRes.error(function(data, status, headers, config) {
			});
		}
	};
	$scope.checkMandatoryDocsForResearch();
	completionCheckService.makeFieldsMandatory(mandatoryFields.researchRelated);
	completionCheckService.makeFieldsMandatory(mandatoryFields.fundingRelated);
	completionCheckService.makeFieldsMandatory(mandatoryFields.legalRelated);
	//code ends here
	    $scope.checkForErrorInApplication=function(){
	    	$scope.applicationMode= "NewApplication";
	    	if(isMemoSubmission == 'true'){
	    		$scope.applicationMode= "AD_HOC_APPLICATION";	
	    	}else if($scope.isAmendmendMode == 'true'){
	    		$scope.applicationMode= "AMEND";	
	    	}else{
	    		$scope.applicationMode= "NewApplication";
	    	}
	    	errorWarningService.getForErrorInApplication(researchId,$scope.applicationMode);
		}
		if(researchId==null || researchId==undefined 
				|| researchId=='NaN' || researchId==""){
			$rootScope.hideWhenItIsNewApplication=true;
		}else{
			//$rootScope.hideWhenItIsNewApplication=false;
			$scope.checkForErrorInApplication();
		}
	/**
	 * for access control module code
	 */
	 var requestedUrl="url";
	  var URL=window.location.href;
	   requestedUrl = URL.substring(URL.lastIndexOf('/') + 1);
	   URL="/"+requestedUrl;
	   var pageDetailsSession1=JSON.parse(sessionStorage.getItem("urlAction"));
	   componentService.getComponentActionForProjectRoles($scope,URL,pageDetailsSession1);
	   $scope.$MyService=componentService;
	   
	   // code for rfc service call
		$scope.$clarificationServiceObj=clarificationService;
		 clarificationService.getClarificationServiceScope($scope);
		 $scope.reqtHrdIdTemp= parseInt(sessionStorage.getItem("rfcHrdId"));
	        if($scope.reqtHrdIdTemp==undefined || $scope.reqtHrdIdTemp==""|| $scope.reqtHrdIdTemp=="0"){
	        	sessionStorage.setItem("reqtHrdId", 1);
	        }
		 $scope.functionId= sessionStorage.getItem("functionId");
		 if($scope.functionId=="CLR"){
			 clarificationService.getRequestClarificationForUser();
		 }else if($scope.functionId=="RSP"){
			 $rootScope.getAllReqRespClarification();
			 clarificationService.getFiledChangedInPageForSite();
		 }
	   // end
	   $scope.isResearchDocument=true;
	   $scope.isFundingRelatedDocsForm=false;
	   $scope.isLegalRelatedDocsForm=false;
	   
	   $scope.updateResearchForm=false;
	   $scope.updateFundingForm=false;
	   $scope.updateLegalForm=false;
	   $scope.updateInstitutionalForm=false;
	   $scope.updateRegulatoryForm=false;
	// finish access control module impl
	$scope.updateshow=false;
	$scope.cancelshow=false;
	$scope.addshow=true;
	
	$scope.fundingUpdateshow=false;
	$scope.fundingCancelshow=false;
	$scope.fundingAddshow=true;
	
	 $scope.legalUpdateshow=false;
	 $scope.legalCancelshow=false;
	 $scope.legalAddshow=true;
	 $rootScope.researchDocumentPercentage=0;
	 $rootScope.researchFundingPercentage=0;
	 $rootScope.researchLegalPercentage=0;
	 $scope.resetResearchDocumentsData=function(researchDocument){
		 	highlightTableRowService.removeHighlight();
			$scope.doctype='';
			$scope.doc_description='';
			//document.getElementById("file_name").value = "";
			 //angular.element("input[type='file']").val(null);
			    $scope.file_name="";
			    $scope.doc_description="";
			$scope.language='';
			$scope.pages='';
			$scope.addshow=true;
			$scope.updateshow=false;
			$scope.researchDocument.$setPristine(true);
		}
$rootScope.documentPercentage = 0;
$scope.completenessCheck=function(){
	$rootScope.documentPercentage=completionCheckService.checkCompletePercentageForTable(messages.validateCompleteness);
}

$scope.openResearchReviewer=function()
{
	$window.location.href = "#/new-research-submission/research-reviewer";
}

//get research category
$scope.getResearchCategory=function(){
      var dataObjForCourse = {
                    codeSet             :      "DOC_CATG_011"
        };
      var res = $http.post('getCodeSetByParentCodeSetextra', dataObjForCourse);
      res.success(function(data, status, headers, config) {
             $scope.researchTypeCategory=[];
             $scope.researchTypeCategory=data;
             $scope.orderbyresearchTypeCategory="shortDesc";
       });
      res.error(function(data, status, headers, config) {
      });    
}

$scope.getResearchCategory();

//Resetting files
$scope.clear = function () {
    angular.element("input[type='file']").val(null);
};

//Resetting files ends here
//Language Drop down values
$scope.getLanguages=function(){
      var dataObjForCourse = {
                    codeSet             :      "LANGUAGE"
        };
   /* var res = $http.post('getCodeSetByCodeSetType', dataObjForCourse);
      res.success(function(data, status, headers, config) {
    	  $scope.languages=[];
    	  $scope.languages=data.codeSetsEntity;
           
      });
      res.error(function(data, status, headers, config) {
      }); */   
      NewCodeSetServiceJS.getAllCodeSetsByType(dataObjForCourse)
      .then(function (data) {
    	 $scope.languages=[];
     	 $scope.languages = data.codeSetsEntity;
       },
      function (errorMessage) {
       });
 }

$scope.getLanguages();
var resId=parseInt(sessionStorage.getItem("resAppId"));
$rootScope.researchApplicationId=resId;
//language call ends

var $table = $('#documentation');

$scope.genericMethod=function(){
	    if(isMemoSubmission=='true'){
	    	$scope.urlToCall = "get-add-hoc-docs-by-id";
	    }else{
	    	$scope.urlToCall = "get-res-docs-by-id";
	    }
	$http({method : 'GET',url : $scope.urlToCall,params: { id:resId}})
	.success(function(data, status, headers, config) {
		$scope.researchDocumentsData=data.ResearcDoc.ReserachDocuments;
		
		if($scope.researchDocumentsData.length>0)
		  {
		  $scope.legaelated1=false;
		  }
	  else
		  {
		  $scope.legaelated1=true;
		  
		  }	
		
		$scope.fundingDocument=data.FundingDoc.FuncindDocuments;
		
		if($scope.fundingDocument.length>0)
		  {
		  $scope.legaelated=false;
		  }
	  else
		  {
		  $scope.legaelated=true;
		  
		  }	
		
		
		$scope.legalDocument=data.LegalDoc.LegalDocuments;
		
		if($scope.legalDocument.length>0)
		  {
		  $scope.funding=false;
		  }
	  else
		  {
		  $scope.funding=true;
		  
		  
		  }
		
	$scope.institutionalDocument=data.InstitutionalDoc.InstitutionalDocuments;
			
		if($scope.institutionalDocument.length>0)
		  {
		  $scope.institutional=false;
		  }
	  else
		  {
		  $scope.institutional=true;
		  }
		
		$scope.regulatoryDocument=data.RegulatoryDoc.RegulatoryDocuments;
		
		if($scope.regulatoryDocument.length>0)
		  {
		  $scope.regulatory=false;
		  }
	  else
		  {
		  $scope.regulatory=true;
		  }
		$scope.AdHocDocuments=data.AdHocDoc.AdHocDocuments;
		
		if($scope.AdHocDocuments.length>0)
		  {
		  $scope.adHocRelatedTable=false;
		  }
	  else
		  {
		  $scope.adHocRelatedTable=true;
		  }
		
		$('#documentation').bootstrapTable({
		data: $scope.researchDocumentsData 
  		});
		$scope.functionId = sessionStorage.getItem("functionId");
		if(isCaseReport=='true'){
				$scope.checkForPercentage=completionCheckService.percentageCalculationForDocument(completeValidation.percentageCaseRelated);
				if($scope.checkForPercentage){
					$rootScope.researchDocumentPercentage=$rootScope.percentageCompletionCount;
				}
		 }else{
				$scope.checkForPercentage=completionCheckService.percentageCalculationForDocument(completeValidation.percentageResearchRelated);
				if($scope.checkForPercentage){
					$rootScope.researchDocumentPercentage=$rootScope.percentageCompletionCount;
				}
		 }
		
		var isReadOnly=sessionStorage.getItem('isReadOnlyMode');
		$rootScope.isReadOnlyVar = sessionStorage.getItem('isReadOnlyMode');
		$scope.amdSerialNo = parseInt(sessionStorage.getItem('amdSerialNo'));
		$scope.amdStatus = sessionStorage.getItem('amdStatus');
	    if(isNaN($scope.amdSerialNo)){
	    	$scope.amdSerialNo=0;
	    }
		if(isReadOnly=='true'){
			$('#documentation').bootstrapTable('hideColumn', 'doc_action');
			$('#research_related_tab').find('input, textarea,select').attr('disabled', 'disabled');
			$('#research_related_tab').find('a').hide();
			$('#researchRelated').find('a').hide();
			$('#ad_hoc_related_tab').find('a').hide();
			$('#ad_hoc_related_tab').find('input, textarea,select').attr('disabled', 'disabled');
			$scope.hideDocumentsButtons=true;
			$('#reserach_document').find('a').show();
		}
		$('#documentation').bootstrapTable('load', $scope.researchDocumentsData);
		if ($scope.amdSerialNo > 0 && sessionStorage.getItem("workItemSubCode")=="AMEND_MODE" && isReadOnly == 'true') {
            clarificationService.getAmendmentFieldChangesInNRA("document");
        }
		$scope.addBubbleDataForDocument($scope.researchDocumentsData);
		$('#funding_docs_table').bootstrapTable({
			data: $scope.fundingDocument 
    			});
		if( $scope.fundingDocument.length>0){
			$scope.checkForPercentage=completionCheckService.percentageCalculationForDocument(completeValidation.percentageFundingRelated);
			if($scope.checkForPercentage){
				$rootScope.researchDocumentPercentage=$rootScope.percentageCompletionCount;
			}
		}
		if(isReadOnly=='true'){
			$('#funding_docs_table').bootstrapTable('hideColumn', 'fund_action');
			$('#funding_related_tab').find('input, textarea,select').attr('disabled', 'disabled');
			$('#funding_related_tab').find('a').hide();
			$('#fundingRelated').find('a').hide();
		}
			$('#funding_docs_table').bootstrapTable('load', $scope.fundingDocument);
			$scope.functionId = sessionStorage.getItem("functionId");
			$scope.addBubbleDataForFunding($scope.fundingDocument);
		$('#legal_docs_table').bootstrapTable({
				data: $scope.legalDocument 
 				});
		
		if(isReadOnly=='true'){
			$('#legal_docs_table').bootstrapTable('hideColumn', 'legal_action');
			$('#legal_related_tab').find('input, textarea,select').attr('disabled', 'disabled');
			$('#legal_related_tab').find('a').hide();
			$('#legalRelated').find('a').hide();
			
		}
				$('#legal_docs_table').bootstrapTable('load', $scope.legalDocument);
				$scope.functionId = sessionStorage.getItem("functionId");
				 if( $scope.legalDocument.length>0){
					 $scope.checkForPercentage=completionCheckService.percentageCalculationForDocument(completeValidation.percentageLegalRelated);
						if($scope.checkForPercentage){
							$rootScope.researchDocumentPercentage=$rootScope.percentageCompletionCount;
						}
				 }
				$scope.addBubbleDataForLegal($scope.legalDocument);
				
				$('#institutional_docs_table').bootstrapTable({
					data: $scope.institutionalDocument 
		    			});
				$scope.functionId = sessionStorage.getItem("functionId");
				if(isReadOnly=='true'){
					$('#institutional_docs_table').bootstrapTable('hideColumn', 'fund_action');
					$('#institutional_related_tab').find('input, textarea,select').attr('disabled', 'disabled');
					$('#institutional_related_tab').find('a').hide();
				}
					$('#institutional_docs_table').bootstrapTable('load', $scope.institutionalDocument);
					$scope.addBubbleDataForInstitutional($scope.institutionalDocument);
					
					$('#regulatory_docs_table').bootstrapTable({
						data: $scope.regulatoryDocument 
			    			});
					/*if( $scope.institutionalDocument.length>0){
						$scope.checkForPercentage=completionCheckService.percentageCalculationForDocument(completeValidation.percentageFundingRelated);
						if($scope.checkForPercentage){
							$rootScope.researchDocumentPercentage=$rootScope.percentageCompletionCount;
						}
					}*/
					if(isReadOnly=='true'){
						$('#regulatory_docs_table').bootstrapTable('hideColumn', 'fund_action');
						$('#regulatory_related_tab').find('input, textarea,select').attr('disabled', 'disabled');
						$('#regulatory_related_tab').find('a').hide();
					}
						$('#regulatory_docs_table').bootstrapTable('load', $scope.regulatoryDocument);
						$scope.functionId = sessionStorage.getItem("functionId");
						$scope.addBubbleDataForRegulatory($scope.regulatoryDocument);
						
						$('#adhoc_docs_table').bootstrapTable('load', $scope.AdHocDocuments);
						$scope.addBubbleDataForAdHocDocument($scope.AdHocDocuments);
						$('#adhoc_docs_table').bootstrapTable({
							data: $scope.AdHocDocuments
				    			});
			
	})
	.error(function(data, status, headers, config) {
		
	});
}

$scope.openResDocumentDescModal = function(){
	
}
$scope.colors = [
                 "bubble-box bg-aqua",
                 "bubble-box bg-green",
                 "bubble-box bg-yellow",
                 "bubble-box bg-red",
                 "bubble-box bg-aqua",
                 "bubble-box bg-green",
                 "bubble-box bg-yellow",
                 "bubble-box bg-red",
                 "bubble-box bg-aqua",
                 "bubble-box bg-green",
                 "bubble-box bg-yellow",
                 "bubble-box bg-red",
                 "bubble-box bg-aqua",
                 "bubble-box bg-green",
                 "bubble-box bg-yellow",
                 "bubble-box bg-red",
                 "bubble-box bg-aqua",
                 "bubble-box bg-green",
                 "bubble-box bg-yellow",
                 "bubble-box bg-red"
             ];
$scope.addBubbleDataForDocument=function(data){
	var j=0;
	$scope.tempDocumentDataForRFC=data;
	$("#researchDocumentBubble").empty();
	for(i in data){
		j++;
		 $scope.DocumentData=data[i];
		 var tempValueDocument="tempValueDocument"+i;
		 $scope.tempVal="tempValueDocument"+i
		 $scope[tempValueDocument]=data[i];
		 var languageAndDocExtention ="";
		 var documentShrtDesc ="";
		 var inputbox ="";
		 if($scope.DocumentData.doc_desc != null &&  $scope.DocumentData.doc_desc != undefined && $scope.DocumentData.doc_desc != ""){
			 inputbox="<div class='col-lg-3 col-md-4 bubblesboxw'> <div class='info-box'> <span ng-click='showResearchRelelatedHistory("+$scope.tempVal+")' class='info-box-icon bg-aqua'><p class='fa fa-fw fa-sun-o iconcenter'></p><p class='iconcentertextnum'>"+j+"</p></span> <div class='info-box-content'> <span  class='hideIdSpan' >" + $scope.DocumentData.row_id + "</span><span class='info-box-number'>"+$scope.DocumentData.doc_type_shortDesc+"</span> <span class='info-box-text' data-toggle='tooltip' title='"+$scope.DocumentData.file_name+"'>"+$scope.DocumentData.file+"</span><span class='info-box-text' data-toggle='tooltip' title='"+$scope.DocumentData.doc_desc+"'>"+$scope.DocumentData.doc_desc+"</span><span>"+$scope.DocumentData.language_shortDesc+"<i style='color:red;'>( "+getFileExtenstion($scope.DocumentData.file_name)+")</i></span>"+"</span><span class='info-box-text' style='color:red;'>"+$scope.DocumentData.comment+"</span><a ng-click='fillDataIntoForm("+$scope.tempVal+")' class='small-box-footer moreinfomit' title='More Info'><i class='fa fa-arrow-circle-right'></i></a> </div></div> </div>";
		 }else{
			 inputbox="<div class='col-lg-3 col-md-4 bubblesboxw'> <div class='info-box'> <span ng-click='showResearchRelelatedHistory("+$scope.tempVal+")' class='info-box-icon bg-aqua'><p class='fa fa-fw fa-sun-o iconcenter'></p><p class='iconcentertextnum'>"+j+"</p></span> <div class='info-box-content'> <span  class='hideIdSpan' >" + $scope.DocumentData.row_id + "</span><span class='info-box-number'>"+$scope.DocumentData.doc_type_shortDesc+"</span> <span class='info-box-text'>"+$scope.DocumentData.file+"</span></span><span class='info-box-text' style='color:red;'>"+$scope.DocumentData.comment+"</span><a ng-click='fillDataIntoForm("+$scope.tempVal+")' class='small-box-footer moreinfomit' title='More Info'><i class='fa fa-arrow-circle-right'></i></a> </div></div> </div>";
				
		 }
		 $("#researchDocumentBubble").append(inputbox);
	}
	 $compile($('#researchDocumentBubble'))($scope);
	 if ($scope.functionId == "RSP") {
     	$rootScope.getPageFieldChangeInBubbleForClaification('researchDocumentBubble',data);
     }
}
$scope.addBubbleDataForFunding=function(data){
	$("#researchFundingDocsBubble").empty();
	var j=0;
	$scope.tempFundingDocumentDataForRFC=data;
	for(i in data){
		j++;
		console.log(data);
		 var tempValueFunding="tempValueFunding";
		 $scope.modelDataFunding=data[i];
		 var tempValueFunding="tempValueFunding"+i;
		 $scope.tempFunding="tempValueFunding"+i
		 $scope[tempValueFunding]=data[i];
		 var inputbox="";
		 if($scope.modelDataFunding.doc_desc != null &&  $scope.modelDataFunding.doc_desc != undefined && $scope.modelDataFunding.doc_desc != ""){
			 inputbox="<div class='col-lg-3 col-md-4 bubblesboxw'> <div class='info-box'> <span ng-click='showFundingHistory("+$scope.tempFunding+")'  class='info-box-icon bg-aqua'><p class='fa fa-fw fa-sun-o iconcenter'></p><p class='iconcentertextnum'>"+j+"</p></span> <div class='info-box-content'> <span  class='hideIdSpan' >" + $scope.modelDataFunding.row_id + "</span><span class='info-box-number'>"+$scope.modelDataFunding.doc_type_shortDesc+"</span> <span class='info-box-text' data-toggle='tooltip' title='"+$scope.modelDataFunding.file_name+"'>"+$scope.modelDataFunding.file+"</span><span class='info-box-text' data-toggle='tooltip' title='"+$scope.modelDataFunding.doc_desc+"'>"+$scope.modelDataFunding.doc_desc+"</span><span>"+$scope.modelDataFunding.language_shortDesc+"<i style='color:red;'>( "+getFileExtenstion($scope.modelDataFunding.file_name)+")</i></span>"+"</span><span class='info-box-text' style='color:red;'>"+$scope.modelDataFunding.comment+"</span><a ng-click='fillDataIntoFormFunding("+$scope.tempFunding+")' class='small-box-footer moreinfomit' title='More Info'><i class='fa fa-arrow-circle-right'></i></a> </div></div> </div>";
		 }else{
			 inputbox="<div class='col-lg-3 col-md-4 bubblesboxw'> <div class='info-box'> <span ng-click='showFundingHistory("+$scope.tempFunding+")'  class='info-box-icon bg-aqua'><p class='fa fa-fw fa-sun-o iconcenter'></p><p class='iconcentertextnum'>"+j+"</p></span> <div class='info-box-content'> <span  class='hideIdSpan' >" + $scope.modelDataFunding.row_id + "</span><span class='info-box-number'>"+$scope.modelDataFunding.doc_type_shortDesc+"</span> <span class='info-box-text'>"+$scope.modelDataFunding.file+"</span><span class='info-box-text' style='color:red;'>"+$scope.modelDataFunding.comment+"</span><a ng-click='fillDataIntoFormFunding("+$scope.tempFunding+")' class='small-box-footer moreinfomit' title='More Info'><i class='fa fa-arrow-circle-right'></i></a> </div></div> </div>";
		 }
		 $("#researchFundingDocsBubble").append(inputbox);
		 if ($scope.functionId == "RSP") {
		     	$rootScope.getPageFieldChangeInBubbleForClaification('researchDocumentBubble',data);
		     }
	}
	 $compile($('#researchFundingDocsBubble'))($scope);
	 if ($scope.functionId == "RSP") {
	     	$rootScope.getPageFieldChangeInBubbleForClaification('researchFundingDocsBubble',data);
	  }
	
}
$scope.addBubbleDataForInstitutional=function(data){
	$("#researchinstitutionalDocsBubble").empty();
	var j=0;
	$scope.tempInstituteDocumentDataForRFC=data;
	for(i in data){
		j++;
		 var tempValueInstitutional="tempValueInstitutional";
		 $scope.modelDataInstitutional=data[i];
		 var tempValueInstitutional="tempValueInstitutional"+i;
		 $scope.tempInstitutional="tempValueInstitutional"+i
		 $scope[tempValueInstitutional]=data[i];
		 var inputbox ="";
		 if($scope.modelDataInstitutional.doc_desc != null &&  $scope.modelDataInstitutional.doc_desc != undefined && $scope.modelDataInstitutional.doc_desc != ""){
			 inputbox="<div class='col-lg-3 col-md-4 bubblesboxw'> <div class='info-box'> <span ng-click='showInstitutionalHistory("+$scope.tempInstitutional+")' class='info-box-icon bg-aqua'><p class='fa fa-fw fa-sun-o iconcenter'></p><p class='iconcentertextnum'>"+j+"</p></span> <div class='info-box-content'> <span  class='hideIdSpan' >" + $scope.modelDataInstitutional.row_id + "</span><span class='info-box-number'>"+$scope.modelDataInstitutional.doc_type_shortDesc+"</span> <span class='info-box-text' data-toggle='tooltip' title='"+$scope.modelDataInstitutional.file_name+"'>"+$scope.modelDataInstitutional.file+"</span><span class='info-box-text' data-toggle='tooltip' title='"+$scope.modelDataInstitutional.doc_desc+"'>"+$scope.modelDataInstitutional.doc_desc+"</span><span>"+$scope.modelDataInstitutional.language_shortDesc+"<i style='color:red;'>( "+getFileExtenstion($scope.modelDataInstitutional.file_name)+")</i></span>"+"</span><span class='info-box-text' style='color:red;'>"+$scope.modelDataInstitutional.comment+"</span><a ng-click='fillDataIntoFormInstitutional("+$scope.tempInstitutional+")' class='small-box-footer moreinfomit' title='More Info'><i class='fa fa-arrow-circle-right'></i></a> </div></div> </div>";
		 }else{
			 inputbox="<div class='col-lg-3 col-md-4 bubblesboxw'> <div class='info-box'> <span ng-click='showInstitutionalHistory("+$scope.tempInstitutional+")' class='info-box-icon bg-aqua'><p class='fa fa-fw fa-sun-o iconcenter'></p><p class='iconcentertextnum'>"+j+"</p></span> <div class='info-box-content'> <span  class='hideIdSpan' >" + $scope.modelDataInstitutional.row_id + "</span><span class='info-box-number'>"+$scope.modelDataInstitutional.doc_type_shortDesc+"</span> <span class='info-box-text'>"+$scope.modelDataInstitutional.file+"</span><span class='info-box-text' style='color:red;'>"+$scope.modelDataInstitutional.comment+"</span><a ng-click='fillDataIntoFormInstitutional("+$scope.tempInstitutional+")' class='small-box-footer moreinfomit' title='More Info'><i class='fa fa-arrow-circle-right'></i></a> </div></div> </div>";
		 }
		 $("#researchinstitutionalDocsBubble").append(inputbox);
	}
	 $compile($('#researchinstitutionalDocsBubble'))($scope);
	 if ($scope.functionId == "RSP") {
	     	$rootScope.getPageFieldChangeInBubbleForClaification('researchinstitutionalDocsBubble',data);
	  }
	
}
$scope.addBubbleDataForRegulatory=function(data){
	$("#researchRegulatoryDocsBubble").empty();
	var j=0;
	$scope.tempRegulatoryDocumentDataForRFC=data;
	for(i in data){
		j++;
		 var tempValueRegulatory="tempValueRegulatory";
		 $scope.modelDataRegolatory=data[i];
		 var tempValueRegulatory="tempValueRegulatory"+i;
		 $scope.tempRegulatory="tempValueRegulatory"+i
		 $scope[tempValueRegulatory]=data[i];
		 var inputbox ="";
		 if($scope.modelDataRegolatory.doc_desc != null &&  $scope.modelDataRegolatory.doc_desc != undefined && $scope.modelDataRegolatory.doc_desc != ""){
			 inputbox="<div class='col-lg-3 col-md-4 bubblesboxw'> <div class='info-box'> <span ng-click='showRegulatoryHistory("+$scope.tempRegulatory+")' class='info-box-icon bg-aqua'><p class='fa fa-fw fa-sun-o iconcenter'></p><p class='iconcentertextnum'>"+j+"</p></span> <div class='info-box-content'> <span  class='hideIdSpan' >" + $scope.modelDataRegolatory.row_id + "</span><span class='info-box-number'>"+$scope.modelDataRegolatory.doc_type_shortDesc+"</span> <span class='info-box-text' data-toggle='tooltip' title='"+$scope.modelDataRegolatory.file_name+"'>"+$scope.modelDataRegolatory.file+"</span><span class='info-box-text' data-toggle='tooltip' title='"+$scope.modelDataRegolatory.doc_desc+"'>"+$scope.modelDataRegolatory.doc_desc+"</span><span>"+$scope.modelDataRegolatory.language_shortDesc+"<i style='color:red;'>( "+getFileExtenstion($scope.modelDataRegolatory.file_name)+")</i></span>"+"</span><span class='info-box-text' style='color:red;'>"+$scope.modelDataRegolatory.comment+"</span><a ng-click='fillDataIntoFormRegulatory("+$scope.tempRegulatory+")' class='small-box-footer moreinfomit' title='More Info'><i class='fa fa-arrow-circle-right'></i></a> </div></div> </div>";
		 }else{
			 inputbox="<div class='col-lg-3 col-md-4 bubblesboxw'> <div class='info-box'> <span ng-click='showRegulatoryHistory("+$scope.tempRegulatory+")' class='info-box-icon bg-aqua'><p class='fa fa-fw fa-sun-o iconcenter'></p><p class='iconcentertextnum'>"+j+"</p></span> <div class='info-box-content'> <span  class='hideIdSpan' >" + $scope.modelDataRegolatory.row_id + "</span><span class='info-box-number'>"+$scope.modelDataRegolatory.doc_type_shortDesc+"</span> <span class='info-box-text'>"+$scope.modelDataRegolatory.file+"</span><span class='info-box-text' style='color:red;'>"+$scope.modelDataRegolatory.comment+"</span><a ng-click='fillDataIntoFormRegulatory("+$scope.tempRegulatory+")' class='small-box-footer moreinfomit' title='More Info'><i class='fa fa-arrow-circle-right'></i></a> </div></div> </div>";
		 }
		 $("#researchRegulatoryDocsBubble").append(inputbox);
	}
	 $compile($('#researchRegulatoryDocsBubble'))($scope);
	 if ($scope.functionId == "RSP") {
	     	$rootScope.getPageFieldChangeInBubbleForClaification('researchRegulatoryDocsBubble',data);
	  }
	
}
$scope.addBubbleDataForLegal=function(data){
	$("#researchLegalDocsBubble").empty();
	var j=0;
	$scope.tempLegalDocumentDataForRFC=data;
	for(i in data){
		j++;
		 $scope.modelDataLegal=data[i];
		 var tempValueLegal="tempValueLegal"+i;
		 $scope.tempLegal="tempValueLegal"+i
		 $scope[tempValueLegal]=data[i];
		 var inputbox ="";
		 if($scope.modelDataLegal.doc_desc != null &&  $scope.modelDataLegal.doc_desc != undefined && $scope.modelDataLegal.doc_desc != ""){
			 inputbox="<div class='col-lg-3 col-md-4 bubblesboxw'> <div class='info-box'> <span ng-click='showLegalHistory("+$scope.tempLegal+")' class='info-box-icon bg-aqua'><p class='fa fa-fw fa-sun-o iconcenter'></p><p class='iconcentertextnum'>"+j+"</p></span> <div class='info-box-content'> <span  class='hideIdSpan' >" + $scope.modelDataLegal.row_id + "</span><span class='info-box-number'>"+$scope.modelDataLegal.doc_type_shortDesc+"</span> <span class='info-box-text' data-toggle='tooltip' title='"+$scope.modelDataLegal.file_name+"'>"+$scope.modelDataLegal.file+"</span><span class='info-box-text' data-toggle='tooltip' title='"+$scope.modelDataLegal.doc_desc+"'>"+$scope.modelDataLegal.doc_desc+"</span><span>"+$scope.modelDataLegal.language_shortDesc+"<i style='color:red;'>( "+getFileExtenstion($scope.modelDataLegal.file_name)+")</i></span>"+"</span><span class='info-box-text' style='color:red;'>"+$scope.modelDataLegal.comment+"</span><a ng-click='fillDataIntoFormLegal("+$scope.tempLegal+")' class='small-box-footer moreinfomit' title='More Info'><i class='fa fa-arrow-circle-right'></i></a> </div></div> </div>";
		 }else{
			 inputbox="<div class='col-lg-3 col-md-4 bubblesboxw'> <div class='info-box'> <span ng-click='showLegalHistory("+$scope.tempLegal+")' class='info-box-icon bg-aqua'><p class='fa fa-fw fa-sun-o iconcenter'></p><p class='iconcentertextnum'>"+j+"</p></span> <div class='info-box-content'> <span  class='hideIdSpan' >" + $scope.modelDataLegal.row_id + "</span><span class='info-box-number'>"+$scope.modelDataLegal.doc_type_shortDesc+"</span> <span class='info-box-text' >"+$scope.modelDataLegal.file+"</span><span class='info-box-text' style='color:red;'>"+$scope.modelDataLegal.comment+"</span><a ng-click='fillDataIntoFormLegal("+$scope.tempLegal+")' class='small-box-footer moreinfomit' title='More Info'><i class='fa fa-arrow-circle-right'></i></a> </div></div> </div>";
		 }
		 $("#researchLegalDocsBubble").append(inputbox);
	}
	 $compile($('#researchLegalDocsBubble'))($scope);
	 if ($scope.functionId == "RSP") {
	     	$rootScope.getPageFieldChangeInBubbleForClaification('researchLegalDocsBubble',data);
	  }
}
$scope.addBubbleDataForAdHocDocument=function(data){
	var j=0;
	$scope.tempAdHocDocumentDataForRFC=data;
	$("#adHocRelatedDocsBubble").empty();
	for(i in data){
		j++;
		 $scope.modelDataAdHocDoc=data[i];
		 var tempValueAdHoc="tempValueAdHoc"+i;
		 $scope.tempVal="tempValueAdHoc"+i
		 $scope[tempValueAdHoc]=data[i];
		 var inputbox="<div class='col-lg-3 col-md-4 bubblesboxw'> <div class='info-box'> <span ng-click='showAdHocDocHistory("+$scope.tempVal+")' class='info-box-icon bg-aqua'><p class='fa fa-fw fa-sun-o iconcenter'></p><p class='iconcentertextnum'>"+j+"</p></span> <div class='info-box-content'> <span  class='hideIdSpan' >" + $scope.modelDataAdHocDoc.row_id + "</span><span class='info-box-number'>"+$scope.DocumentData.doc_type_shortDesc+"</span> <span class='info-box-text'>"+$scope.modelDataAdHocDoc.file+"</span><span class='info-box-text' style='color:red;'>"+$scope.modelDataAdHocDoc.comment+"</span><a ng-click='fillDataIntoAdHocForm("+$scope.tempVal+")' class='small-box-footer moreinfomit' title='More Info'><i class='fa fa-arrow-circle-right'></i></a> </div></div> </div>";
		 $("#adHocRelatedDocsBubble").append(inputbox);
	}
	 $compile($('#adHocRelatedDocsBubble'))($scope);
	 if ($scope.functionId == "RSP") {
     	$rootScope.getPageFieldChangeInBubbleForClaification('adHocRelatedDocsBubble',data);
     }
}
$scope.showResearchRelelatedHistory=function(row){
	$scope.documentHistoryData=row.history;
	$scope.tempDocumentType=row.doc_type_shortDesc;
	$scope.isDocumentHistoryModal=true;
}
$scope.fillDataIntoForm=function(row){
	$.confirm({
		    title: mesaages.areusure,
		    content_box: mesaages.editrow,
		    confirm: function(){
		    	if ($scope.functionId == "RSP") {
           		 $scope.setFiledChangedInPage('HACView_Research_documents_documentation_table',row);
               }
		    	$scope.updateshow=true;
		   	$scope.cancelshow=true;
		   	$scope.addshow=false;
		    	 $scope.selected = row;
		    	 $scope.doctype=$scope.selected.doc_type_codeSet;
  				$scope.doc_description=$scope.selected.doc_desc;
  				$scope.doctypeshortDesc=$scope.selected.doc_type_shortDesc;
  				$scope.language=$scope.selected.language;
  				$scope.languagetitle=$scope.selected.language_shortDesc;
  				$scope.pages=$scope.selected.pages;
  				$scope.row_id= $scope.selected.row_id;
  				$scope.uploadedFileName=$scope.selected.file_noHref;
  				$scope.updateResearchForm=true;
  				completionCheckService.resetField(messages.validateSaveForLater);
  				if($scope.selected.is_stamped==true){
  					if ($scope.amdSerialNo > 0 && sessionStorage.getItem("workItemSubCode")=="AMEND_MODE") {
  						$scope.disableIfDocIsStamped=false;
  					}else{
  						$scope.disableIfDocIsStamped=true;
  					}
				}else{
					$scope.disableIfDocIsStamped=false;
				}
  				if ($scope.amdSerialNo > 0 && sessionStorage.getItem("workItemSubCode")=="AMEND_MODE") {
		    		$scope.subTableId=[];
	            	$scope.subTableId.push("expenseDocumentTable");
	            	$rootScope.highelightFieldForAmendment($scope.selected.row_id,$scope.subTableId,messages.validateSaveForLater);
                }
  				$scope.$apply();
				$("#research_related_tab").css({ display: "block" });
				$( ".back-to-top" ).trigger( "click" );
		    }
 	});
}
$scope.showFundingHistory=function(row){
	$scope.documentHistoryData=row.history;
	$scope.tempDocumentType=row.doc_type_shortDesc;
	$scope.isDocumentHistoryModal=true;
}
$scope.fillDataIntoFormFunding=function(row){
	
	$.confirm({
		    title: mesaages.areusure,
		    content_box: mesaages.editrow,
		    confirm: function(){
		    	if ($scope.functionId == "RSP") {
	           		 $scope.setFiledChangedInPage('HACView_Research_documents_funding_related_table',row);
	               }
		    	$scope.fundingUpdateshow=true;
		   	$scope.fundingCancelshow=true;
		   	$scope.fundingAddshow=false;
		    	 $scope.selected = row;
		    	 $scope.funding_doctype=$scope.selected.doc_type_codeSet;
   				$scope.funding_doc_description=$scope.selected.doc_desc;
   				$scope.funding_language=$scope.selected.language;
   				$scope.funding_pages=$scope.selected.pages;
   				//$scope.funding_doc_file= $scope.selected.file;
   				$scope.funding_doc_file2= $scope.selected.file_noHref;
   				$scope.row_id= $scope.selected.row_id;
   				 $scope.updateFundingForm=true;
   				completionCheckService.resetField(messages.validateSaveForLater);
   				if(row.is_stamped==true){
   					if ($scope.amdSerialNo > 0 && sessionStorage.getItem("workItemSubCode")=="AMEND_MODE") {
   						$scope.disableIfDocIsStamped=false;
   					}else{
   						$scope.disableIfDocIsStamped=true;
   					}
					
				}else{
					$scope.disableIfDocIsStamped=false;
				}
   				if ($scope.amdSerialNo > 0 && sessionStorage.getItem("workItemSubCode")=="AMEND_MODE") {
		    		$scope.subTableId=[];
	            	$scope.subTableId.push("expenseDocumentTable");
	            	$rootScope.highelightFieldForAmendment($scope.selected.row_id,$scope.subTableId,messages.validateSaveForLaterForFunding);
                }
   				$scope.$apply();
				$("#funding_related_tab").css({ display: "block" });
				$( ".back-to-top" ).trigger( "click" );
		    }
  	});
}
$scope.showInstitutionalHistory=function(row){
	$scope.documentHistoryData=row.history;
	$scope.tempDocumentType=row.doc_type_shortDesc;
	$scope.isDocumentHistoryModal=true;
}
$scope.fillDataIntoFormInstitutional=function(row){
	$.confirm({
		    title: mesaages.areusure,
		    content_box: mesaages.editrow,
		    confirm: function(){
		    	if ($scope.functionId == "RSP") {
	           		 $scope.setFiledChangedInPage('HACView_Research_documents_institutional_related_table',row);
	               }
		    	$scope.updateInstitutionalForm=true;
		    	$scope.institutionalDisable=true;
		    	 $scope.selected = row;
		    	 $scope.institutional_doctype=$scope.selected.doc_type_codeSet;
   				$scope.institutional_doc_description=$scope.selected.doc_desc;
   				$scope.institutional_language=$scope.selected.language;
   				$scope.institutional_pages=$scope.selected.pages;
   				$scope.institutional_doc_file2= $scope.selected.file_noHref;
   				$scope.row_id= $scope.selected.row_id;
   				// $scope.updateFundingForm=true;
   				//completionCheckService.resetField(messages.validateSaveForLater);
   				if(row.is_stamped==true){
   					if ($scope.amdSerialNo > 0 && sessionStorage.getItem("workItemSubCode")=="AMEND_MODE") {
   						$scope.disableIfDocIsStamped=false;
   					}else{
   						$scope.disableIfDocIsStamped=true;
   					}
					
				}else{
					$scope.disableIfDocIsStamped=false;
				}
   				if ($scope.amdSerialNo > 0 && sessionStorage.getItem("workItemSubCode")=="AMEND_MODE") {
		    		$scope.subTableId=[];
	            	$scope.subTableId.push("expenseDocumentTable");
	            	$rootScope.highelightFieldForAmendment($scope.selected.row_id,$scope.subTableId,messages.validateSaveForLaterForInstitutional );
                }
   				$scope.$apply();
				$("#institutional_related_tab").css({ display: "block" });
				$( ".back-to-top" ).trigger( "click" );
		    }
  	});
}
$scope.showRegulatoryHistory=function(row){
	$scope.documentHistoryData=row.history;
	$scope.tempDocumentType=row.doc_type_shortDesc;
	$scope.isDocumentHistoryModal=true;
}
$scope.fillDataIntoFormRegulatory=function(row){
	$.confirm({
		    title: mesaages.areusure,
		    content_box: mesaages.editrow,
		    confirm: function(){
		    	if ($scope.functionId == "RSP") {
	           		 $scope.setFiledChangedInPage('HACView_Research_documents_regulatory_related_table',row);
	               }
		    	$scope.updateRegulatoryForm=true;
		    	$scope.regulatoryDisable=true;
		    	 $scope.selected = row;
		    	 $scope.regulatory_doctype=$scope.selected.doc_type_codeSet;
   				$scope.regulatory_doc_description=$scope.selected.doc_desc;
   				$scope.regulatory_language=$scope.selected.language;
   				$scope.regulatory_pages=$scope.selected.pages;
   				$scope.regulatory_doc_file2= $scope.selected.file_noHref;
   				$scope.row_id= $scope.selected.row_id;
   				if(row.is_stamped==true){
   					if ($scope.amdSerialNo > 0 && sessionStorage.getItem("workItemSubCode")=="AMEND_MODE") {
   						$scope.disableIfDocIsStamped=false;
   					}else{
   						$scope.disableIfDocIsStamped=true;
   					}
					
				}else{
					$scope.disableIfDocIsStamped=false;
				}
   				if ($scope.amdSerialNo > 0 && sessionStorage.getItem("workItemSubCode")=="AMEND_MODE") {
		    		$scope.subTableId=[];
	            	$scope.subTableId.push("expenseDocumentTable");
	            	$rootScope.highelightFieldForAmendment($scope.selected.row_id,$scope.subTableId,messages.validateSaveForLaterForRegulatory);
                }
   				$scope.$apply();
				$("#regulatory_related_tab").css({ display: "block" });
				$( ".back-to-top" ).trigger( "click" );
		    }
  	});
}
$scope.showLegalHistory=function(row){
	$scope.documentHistoryData=row.history;
	$scope.tempDocumentType=row.doc_type_shortDesc;
	$scope.isDocumentHistoryModal=true;
}
$scope.fillDataIntoFormLegal=function(row){
	$.confirm({
		    title: mesaages.areusure,
		    content_box: mesaages.editrow,
		    confirm: function(){
		    	if ($scope.functionId == "RSP") {
	           		 $scope.setFiledChangedInPage('HACView_Research_documents_legal_related_table',row);
	               }
		    	$scope.legalUpdateshow=true;
		   	$scope.legalCancelshow=true;
		   	$scope.legalAddshow=false;
		    	 $scope.selected = row;
		    	 $scope.legal_doctype=$scope.selected.doc_type_codeSet;
     				$scope.legal_doc_description=$scope.selected.doc_desc;
     				$scope.legal_language=$scope.selected.language;
     				$scope.legal_pages=$scope.selected.pages;
     				$scope.row_id= $scope.selected.row_id;
     				$scope.legal_doc_file_nohref= $scope.selected.file_noHref;
     				$scope.updateLegalForm=true;
     				completionCheckService.resetField(messages.validateSaveForLater);
     				if(row.is_stamped==true){
       					if ($scope.amdSerialNo > 0 && sessionStorage.getItem("workItemSubCode")=="AMEND_MODE") {
       						$scope.disableIfDocIsStamped=false;
       					}else{
       						$scope.disableIfDocIsStamped=true;
       					}
    					
    				}else{
    					$scope.disableIfDocIsStamped=false;
    				}
     				if ($scope.amdSerialNo > 0 && sessionStorage.getItem("workItemSubCode")=="AMEND_MODE") {
    		    		$scope.subTableId=[];
    	            	$scope.subTableId.push("expenseDocumentTable");
    	            	$rootScope.highelightFieldForAmendment($scope.selected.row_id,$scope.subTableId,messages.validateSaveForLaterForLegal);
                    }
     				$scope.$apply();
			$("#legal_related_tab").css({ display: "block" });
			$( ".back-to-top" ).trigger( "click" );
		    }
    	});
}
$scope.showAdHocDocHistory=function(row){
	$scope.documentHistoryData=row.history;
	$scope.tempDocumentType=row.doc_type_shortDesc;
	$scope.isDocumentHistoryModal=true;
}
$scope.genericMethod();
//code for research bannner is started here
$rootScope.researchProjectTitile=sessionStorage.getItem("project_title");
$rootScope.researchApplicationCreatedDate=sessionStorage.getItem("created_date");
//$scope.banner=researchBanner.researchBannerDisplay($rootScope.researchProjectTitile,$rootScope.researchApplicationCreatedDate);
//code for research banner ends 
$scope.validateData=function(){
}

$scope.researchRelatedalreadyExits=function(){

	var document_type_exits = $scope.doctype;
	angular.forEach($scope.researchDocumentsData, function(value, key){
	      if(value.doc_type == document_type_exits){
	    	  document_type_exits = "";
	    	  
	      }
	   });
	
	if(document_type_exits==""){
		notif({
			type : "warning",
			msg : messages.warningupload,
			position : "center",
			multiline: true,
			timeout : 6000,
			autohide: true
		});
	
		
	}
	$scope.tempAdvRecVal=sessionStorage.getItem("adviceReceived");
	if($scope.tempAdvRecVal=="false"){
		if($scope.doctype=="DT_SCN_DESN"){
			notif({
				type : "warning",
				msg : messages.docRestrctWarn,
				position : "center",
				multiline: true,
				timeout : 6000,
				autohide: true
			});
		}
	}
	
}

$scope.fundingRelatedalreadyExits=function(){

	var document_type_exits = $scope.funding_doctype;
	angular.forEach($scope.fundingDocument, function(value, key){
	      if(value.doc_type == document_type_exits){
	    	  document_type_exits = "";
	    	  
	      }
	   });
	
	if(document_type_exits==""){
		notif({
			type : "warning",
			msg : messages.warningupload,
			position : "center",
			multiline: true,
			timeout : 6000,
			autohide: true
		});
	
		
	}
	
}

$scope.legalRelatedalreadyExits=function(){

	var document_type_exits = $scope.legal_doctype; 
	angular.forEach($scope.legalDocument, function(value, key){
	      if(value.doc_type == document_type_exits){
	    	  document_type_exits = "";
	    	  
	      }
	   });
	
	if(document_type_exits==""){
		notif({
			type : "warning",
			msg : messages.warningupload,
			position : "center",
			multiline: true,
			timeout : 6000,
			autohide: true
		});
	
		
	}
	
}

$rootScope.researchDocumentPercentage=0;
//ends
//Adding new record code starts here 
$scope.addResearchDocumentsData=function(){
	var defer = $q.defer();
	$scope.isDocumentNameExists=false;
	for(var i in $scope.researchDocumentsData){
		if($scope.doc_file!=undefined && $scope.doc_file!=''){
			for(var j=0;j<$scope.doc_file.length;j++){
				if($scope.doc_file[j].name == $scope.researchDocumentsData[i].file_noHref){
					$scope.isDocumentNameExists=true;
				}
			}
			
		}
	}
	if(!$scope.isDocumentNameExists){
		 if(isCaseReport=='true'){
			 $scope.isSave=completionCheckService.saveForLaterCheck(messages.validateSaveForLater,messages.validateCompleteness);
				$scope.checkForPercentage=completionCheckService.percentageCalculationForDocument(completeValidation.percentageCaseRelated);
				if($scope.checkForPercentage){
					$rootScope.researchDocumentPercentage=$rootScope.percentageCompletionCount;
				}
		 }else{
			 $scope.isSave=completionCheckService.saveForLaterCheck(messages.validateSaveForLater,messages.validateCompleteness);
				$scope.checkForPercentage=completionCheckService.percentageCalculationForDocument(completeValidation.percentageResearchRelated);
				if($scope.checkForPercentage){
					$rootScope.researchDocumentPercentage=$rootScope.percentageCompletionCount;
				}
		 }
		
		if($scope.isSave ==false){
			   notif({
					  type: "error",
					  msg: messages.plzFillRedData,
					  position: "center",
					  multiline:true,
					  timeout: 6000
					});
			   defer.reject('false');
			   sessionStorage.setItem("isCorrect", 'false');
			   return false;
		   }
			$scope.tempAdvRecVal=sessionStorage.getItem("adviceReceived");
			if($scope.tempAdvRecVal=="false"){
				if($scope.doctype=="DT_SCN_DESN"){
					notif({
						type : "warning",
						msg : messages.docRestrctWarn,
						position : "center",
						multiline: true,
						timeout : 6000,
						autohide: true
					});
					return false;
				}
			}
			if($scope.pages=="" || $scope.pages==undefined || $scope.pages==null){
				notif({
					type : "warning",
					msg : "Please enter document pages",
					position : "center",
					multiline: true,
					timeout : 6000,
					autohide: true
				});
				return false;
			} if($scope.pages==0 || $scope.pages<0){
				notif({
					type : "warning",
					msg : "Document pages should be greater than 0",
					position : "center",
					multiline: true,
					timeout : 6000,
					autohide: true
				});
				return false;
			}
		if($scope.doc_file!=undefined && $scope.doc_file!="" && $scope.doc_file!="No file" && $scope.doc_file.length!=0){
			var file = $scope.doc_file;
			var type=file;
			var array=[];
			var result="";
			var typesAllowedInUpload=messages.typeOfDocsToUpload;
			 var size=file.size+"";
	   	  	var testsize=messages.maxsize;
			array=typesAllowedInUpload.split(",");
			
			for (var i = 0; i < file.length; i++) {
				for(var j=0;j<array.length;j++){
					if(file[i].type==array[j]){
						result="success";
						break;
					}else{
						result="";
					}
				}
			}
			$scope.isSpecialChar= documentValidation.checkForSpecialCharMulti(file);
			$scope.isSpecialChar= documentValidation.checkForDocumentNameLenghtMulti(file);
			
			if(result!="success" && type!=""){
				 notif({
						type : "warning",
						msg : messages.uploadFilesWarning,
						position : "center",
						multiline: true,
						timeout : 6000,
						autohide: true
					});
				 defer.reject('false');
				 sessionStorage.setItem("isCorrect", 'false');
				 return false;
			}
			
			for(var i=0;i<file.length;i++){
				var size=file[i].size+"";
				var testsize=messages.maxsize; 
				if(Number(testsize)<Number(size)){
							testsize = testsize/1024;
							testsize=testsize/1024;
							notif({
								type : "warning",
								msg : messages.configSize+testsize+".MB",
								position : "center",
								multiline: true,
								timeout : 6000,
								autohide: true
							});
							defer.reject('false');
 							sessionStorage.setItem("isCorrect", 'false');
						 return false; 			
						}
			}
			
			
			
			
		 }else{
		 }
		
		var documentsData={
				document_type:			$scope.doctype,
				document_description:	$scope.doc_description,
				language:				$scope.language,
				pages:					""+$scope.pages,
				document_category:		"DOC_CATG_011",
				research_id:			""+$rootScope.researchApplicationId,
				no_of_documents:parseInt(($scope.doc_file==undefined?1:$scope.doc_file.length)),
		}
		
		
		var document_type_exits = $scope.doctype;
		var document_message=mesaages.editrow;
		
		angular.forEach($scope.researchDocumentsData, function(value, key){
		      if(value.doc_type == document_type_exits){
		    	  document_message = document_type_exits + messages.researchupload;
		    	  document_type_exits = "";
		    	  
		      }
		   });
		
		
		  
			    	//$.confirm({
					   // title: mesaages.areusure,
					   // content_box: document_message,
					   // confirm: function(){
					    $scope.isResearchDocumentExist=false;
					    // exists documents 
					   /* for (var int = 0; int < $scope.researchDocumentsData.length; int++) {
								if($scope.researchDocumentsData[int].doc_type_codeSet == $scope.doctype){
									$scope.isResearchDocumentExist=true;
								}
								
						}*/
					    if(!$scope.isResearchDocumentExist){
					    	$scope.functionId = sessionStorage.getItem("functionId");
				            $scope.reqtHrdIdTemp= parseInt(sessionStorage.getItem("rfcHrdId"));
				            if(isNaN($scope.reqtHrdIdTemp)){
				            	$scope.reqtHrdIdTemp=1;
				            }
				            documentsData['functionId'] = $scope.functionId;
				            documentsData['reqtHrdId'] = $scope.reqtHrdIdTemp;
					    	 var res = $http.post('save-documents-data', documentsData);
							 res.success(function(data, status, headers, config) {
								 if(data>0){
									 defer.resolve('true');
									 sessionStorage.setItem("isCorrect", 'true');
									 $scope.keyPressedForAutoSave = false;
									 sessionStorage.setItem("dataChange", $scope.keyPressedForAutoSave);
									 
									 $scope.NavigateToNextTab();
									
										  $rootScope.$emit('loaderShow', "customLoader");
										  $timeout(function() { 
        				 $rootScope.$emit('loaderHide', "customLoader");
        				 	 $scope.uploadFile("Research_Doc");
        	            }, 400); 
										 //angular.element("input[type='file']").val(null);
									 $scope.doctype='';
										$scope.doc_description='';
										$scope.language='';
										$scope.pages='';
										$scope.researchDocument.$setPristine(true);
										$scope.genericMethod();
										$scope.getBannerDataFromService();
								 }else if (typeof data === 'string' || data instanceof String){
		                 			  if(data.search("The requested URL was rejected") > -1){
		                 				  var supportId = data.match(/\d/g);
		                 				  var errorObject = {
		                  						title :"Error",
		                  						content : '<p class="alert  text-center">Firewall getting blocked. <br />Please contact MRC with screen shot & Send a mail to <b>AbhathSupport@hamad.qa</b> with below support ID<br /><b>Your support ID is :'+supportId.join("")+'</b>.</p>'
		                  				  };
		                  				  ResearchApplicationModalService.openCustomAlertMessage(errorObject);
		                  		 		
		                 			  }
		                 		  }else{
									 notif({
											type : "error",
											msg : messages.resDocSaveError,
											position : "center",
											multiline : true,
											timeout : 6000
										});
								 }
							 });
								 res.error(function(data, status, headers, config) {
									 defer.reject();
									 
								});
					    }else if($scope.isResearchDocumentExist){
					    	notif({
								type : "warning",
								msg : messages.documentExists,
								position : "center",
								multiline : true,
								timeout : 6000
							});
					    }else{
					    	notif({
								type : "warning",
								msg : "Something went wrong please contact admin",
								position : "center",
								multiline : true,
								timeout : 6000
							});
					    }
				//}
			//});
	}else{
		notif({
			type : "warning",
			msg : messages.uploadFileAlreadyExists,
			position : "center",
			multiline : true,
			timeout : 6000
		});
	}
	return defer.promise;
}//adding new record code ends here
/**
 * File upload code
 */
$scope.uploadFile = function(documentType){
      var file = $scope.doc_file;
      var uploadUrl = "upload-res-docs-multiple";
	  $scope.fileUploadAttempt=0;
      return  $scope.uploadFileToUrl(file, uploadUrl,documentType).then(function(response){
          $scope.result = response.data;
		  if( $scope.result==true){
			notif({
											type : "success",
											msg : messages.resDocUpdateSuccess,
											position : "center",
											multiline: true,
											timeout : 6000,
											autohide: true,
											
										});
										$scope.checkForErrorInApplication();
										$scope.NavigateToNextTab();
                  	  $scope.genericMethod();
                        $scope.clear();
                    }else if (typeof $scope.result === 'string' || $scope.result instanceof String){
                  	  if($scope.result.search("The requested URL was rejected") > -1){
           				  var supportId = $scope.result.match(/\d/g);
           				  var errorObject = {
            						title :"Error",
            						content : '<p class="alert  text-center">Firewall getting blocked. <br />Please contact MRC with screen shot & Send a mail to <b>AbhathSupport@hamad.qa</b> with below support ID<br /><b>Your support ID is :'+supportId.join("")+'</b>.</p>'
            				  };
            				  ResearchApplicationModalService.openCustomAlertMessage(errorObject);
           			  }
          		  }else{
          				notif({
          					type : "error",
          					msg : "Document Not uploaded. Contact Admin",
          					position : "center",
          					multiline: true,
          					timeout : 6000,
          					autohide: true,
          					
          				});
          		  }
				  return $scope.result;
          
      });
      
};
$rootScope.extraFileVar=[];
$scope.uploadFileToUrl = function(file, uploadUrl,documentType){
    var fd = new FormData();
    for (var i = 0 ; i < file.length ; i ++){
  	   fd.append('file[]', file[i]);
  	}
    fd.append('doc_type',documentType);
   var result= $http.post(uploadUrl, fd, {
       transformRequest: angular.identity,
       headers: {'Content-Type': undefined}
    })
    .success(function(data, status, headers, config){
  	  $scope.clear();
    })
 
    .error(function(data, status, headers, config){
  	  if(status!=null){
  		  if($scope.fileUploadAttempt>=5){
  			  notif({
					  type: "error",
					  msg: "Due To Network Issue, Please logout and login again Then Try Again." ,
					  position: "center",
					  multiline: true,
					   timeout: 6000
					});
					$scope.clear();
					$scope.genericMethod();
  		  }else{
  		  	   $rootScope.$emit('loaderShow', "customLoader");
  			  console.log("Executed reupload block. Count "+$scope.fileUploadAttempt);
  			   $timeout(function() { 
  			   	    $rootScope.$emit('loaderHide', "customLoader");
  				$scope.fileUploadAttempt=$scope.fileUploadAttempt+1;
				 $scope.uploadFileToUrl(file, uploadUrl,documentType);
	          }, 400);
  		  }
  	  }else{
  		  notif({
				  type: "error",
				  msg: "Unable to Upload Document " +" status: "+ status + "" ,
				  position: "center",
				  multiline: true,
				   timeout: 6000
				});
				$scope.clear();
				$scope.genericMethod();
  	  }
    });
   return result;
   
 }

   $scope.cancelUpdate=function(form){
	   $scope.resetResearchDocumentsData();
	   $scope.updateshow=false;
	   	$scope.cancelshow=false;
	   	$scope.addshow=true;
	    $scope.clear();
	   	$scope.researchDocument.$setPristine(true);
   }
   $scope.updateDocumentation=function(form){
	   var defer = $q.defer();
	   if(isCaseReport=='true'){
			 $scope.isSave=completionCheckService.saveForLaterCheck(messages.validateSaveForLater,messages.validateCompleteness);
		 }else{
			 $scope.isSave=completionCheckService.saveForLaterCheck(messages.validateSaveForLater,messages.validateCompleteness);
		 }
	   if(!$scope.isSave){
		   return false;
	   }
	   $scope.isDocumentNameExistsInUpdate=false;
		for(var i in $scope.researchDocumentsData){
			if($scope.doc_file!=undefined && $scope.doc_file!=''){
				for(var j=0; j<$scope.doc_file.length;j++){
					if($scope.doc_file[j].name== $scope.researchDocumentsData[i].file_noHref){
						$scope.isDocumentNameExistsInUpdate=true;
						break;
					}
				}
				
			}
		}
		if($scope.pages=="" || $scope.pages==undefined || $scope.pages==null){
			notif({
				type : "warning",
				msg : "Please enter document pages",
				position : "center",
				multiline: true,
				timeout : 6000,
				autohide: true
			});
			return false;
		} if($scope.pages==0 || $scope.pages<0){
			notif({
				type : "warning",
				msg : "Document pages should be greater than 0",
				position : "center",
				multiline: true,
				timeout : 6000,
				autohide: true
			});
			return false;
		}
		$scope.tempAdvRecVal=sessionStorage.getItem("adviceReceived");
		if($scope.tempAdvRecVal=="false"){
			if($scope.doctype=="DT_SCN_DESN"){
				notif({
					type : "warning",
					msg : messages.docRestrctWarn,
					position : "center",
					multiline: true,
					timeout : 6000,
					autohide: true
				});
				return false;
			}
		}
		if(!$scope.isDocumentNameExistsInUpdate){
	
			  var dataObj={
					   document_type:			$scope.doctype,
						document_description:	$scope.doc_description,
						language:				$scope.language,
						pages:					""+$scope.pages,
						document_category:		"DOC_CATG_011",
						research_id:			""+$rootScope.researchApplicationId,
						research_doc_id:		""+$scope.row_id,
						no_of_documents:parseInt(($scope.doc_file==undefined?1:$scope.doc_file.length)),
			   }
			   var file = $scope.doc_file;
			   if($scope.doc_file!=undefined && $scope.doc_file!="" && $scope.doc_file!="No file" && $scope.doc_file.length!=0){
					//var file = $scope.doc_file;
					var type=file[0].type;
					var array=[];
					var result="";
					var typesAllowedInUpload=messages.typeOfDocsToUpload;
					
					array=typesAllowedInUpload.split(",");
					
					for (var i = 0; i < array.length; i++) {
						if(type == array[i]){
							result="success";
							break;
						}
					}
					//result="success";
					if(result!="success"&& type!=""){
						 notif({
								type : "warning",
								msg : messages.uploadFilesWarning,
								position : "center",
								multiline: true,
								timeout : 6000,
								autohide: true
							});
						 return false;
					}
					$scope.isSpecialChar= documentValidation.checkForSpecialCharMulti(file);
					$scope.isSpecialChar= documentValidation.checkForDocumentNameLenghtMulti(file);
					//for(var i=0;i<file.length;i++){
						var size=file.size+"";
						var testsize=messages.maxsize; 
						if(Number(testsize)<Number(size)){
							testsize = testsize/1024;
							testsize=testsize/1024;
							notif({
								type : "warning",
								msg : messages.configSize+testsize+".MB",
								position : "center",
								multiline: true,
								timeout : 6000,
								autohide: true
							});
							return false; 			
						}
					//}
					
					
				 }else{
				 }
			   
			   var document_type_exits = $scope.doctype;
				var document_message=mesaages.editrow;

				angular.forEach($scope.researchDocumentsData, function(value, key){
				      if(value.doc_type == document_type_exits && value.row_id!=$scope.row_id){
				    	  document_message = document_type_exits + messages.researchupload;
				    	  document_type_exits = "";
				    	  
				      }
				   });
			   
			   
			  // $.confirm({
				//    title: mesaages.areusure,
				  //  content_box: document_message,
				   // confirm: function(){
			   angular.forEach(form, function(obj) {
					if (angular.isObject(obj)
							&& angular.isDefined(obj.$setDirty)) {
						obj.$setDirty();
					}
				})
				if (form.$valid) {
					$scope.functionId = sessionStorage.getItem("functionId");
					$scope.reqtHrdIdTemp= parseInt(sessionStorage.getItem("rfcHrdId"));
		            if(isNaN($scope.reqtHrdIdTemp)){
		            	$scope.reqtHrdIdTemp=1;
		            }
		            dataObj['functionId'] = $scope.functionId;
		            dataObj['reqtHrdId'] = $scope.reqtHrdIdTemp;
			   var res = $http.post('save-documents-data', dataObj);
				 res.success(function(data, status, headers, config) {
					 if(data>0){
						 defer.resolve('true');
						 sessionStorage.setItem("isCorrect", 'true');
						 $scope.keyPressedForAutoSave = false;
						 sessionStorage.setItem("dataChange", $scope.keyPressedForAutoSave);
						 
						 $scope.NavigateToNextTab();
						 $scope.uploadFile("Research_Doc")
						 //myCallback();
						 $scope.resetResearchDocumentsData();
						 $scope.updateResearchForm=false;
						 $scope.doctype='';
						 //angular.element("input[type='file']").val(null);
							$scope.doc_description='';
							$scope.language='';
							$scope.pages='';
							$scope.updateshow=false;
							$scope.cancelshow=false;
							$scope.addshow=true;
							$scope.researchDocument.$setPristine(true);
							$scope.genericMethod();
							$scope.getBannerDataFromService();
					 }else if (typeof data === 'string' || data instanceof String){
            			  if(data.search("The requested URL was rejected") > -1){
             				  var supportId = data.match(/\d/g);
             				  var errorObject = {
              						title :"Error",
              						content : '<p class="alert  text-center">Firewall getting blocked. <br />Please contact MRC with screen shot & Send a mail to <b>AbhathSupport@hamad.qa</b> with below support ID<br /><b>Your support ID is :'+supportId.join("")+'</b>.</p>'
              				  };
              				  ResearchApplicationModalService.openCustomAlertMessage(errorObject);
              		 		
             			  }
             		  }else{
						 notif({
								type : "error",
								msg : messages.resDocUpdateError,
								position : "center",
								multiline : true,
								timeout : 6000
							});
					 }
					
						
				 });
				 res.error(function(data, status, headers, config) {
					 defer.reject();
					 
				});	
				 return defer.promise;
				}
		}else{
			notif({
				type : "warning",
				msg : messages.uploadFileAlreadyExists,
				position : "center",
				multiline : true,
				timeout : 6000
			});
		}
   }
   
   $scope.editResearchDocument=function(row,index){
    	$.confirm({
		    title: mesaages.areusure,
		    content_box: mesaages.editrow,
		    confirm: function(){
		    	$scope.updateshow=true;
		    	$scope.cancelshow=true;
		    	$scope.addshow=false;
		    	 $scope.selected = row;
				 $scope.indexvalue=index;
				$scope.doctype=$scope.selected.doc_type_codeSet;
				$scope.doc_description=$scope.selected.doc_desc;
				$scope.language=$scope.selected.language;
				$scope.pages=$scope.selected.pages;
				$scope.row_id= $scope.selected.row_id;
				$scope.uploadedFileName=$scope.selected.file_noHref;
				$scope.updateResearchForm=true;
				completionCheckService.resetField(messages.validateSaveForLater);
				if($scope.selected.is_stamped==true){
  					if ($scope.amdSerialNo > 0 && sessionStorage.getItem("workItemSubCode")=="AMEND_MODE") {
  						$scope.disableIfDocIsStamped=false;
  					}else{
  						$scope.disableIfDocIsStamped=true;
  					}
				}else{
					$scope.disableIfDocIsStamped=false;
				}
				if ($scope.amdSerialNo > 0 && sessionStorage.getItem("workItemSubCode")=="AMEND_MODE") {
		    		$scope.subTableId=[];
	            	$scope.subTableId.push("expenseDocumentTable");
	            	$rootScope.highelightFieldForAmendment($scope.selected.row_id,$scope.subTableId,messages.validateSaveForLater);
                }
				$scope.$apply();
				$("#research_related_tab").css({ display: "block" });
				$( ".back-to-top" ).trigger( "click" );
		    }
    	});
   }
   
   $scope.removeResearchDocument=function(row,index){
  	 $scope.isAlloedToDelete=true;
  	 $.each($scope.dataInsertedByWorkFlow,function(key,value){
  		 if(row.row_id==value.docId){
  			 notif({
					  type: "warning",
					  msg: messages.deleteRestrict,
					  position: "center",
					  multiline : true,
					  timeout: 6000
					});
  			 $scope.isAlloedToDelete=false;
  			 return false;
  		 }
  	 });
  	 if($scope.isAlloedToDelete==true){
  		 $.confirm({
   		    title: mesaages.areusure,
   		    content_box: mesaages.deleterow,
   		    confirm: function(){
   		    	$scope.showorhideupdate=true;
   		    	$scope.showorhideadd=false;
   		    	 $scope.selected = row;
	           	var dataObj={
	           			research_doc_id:		""+$scope.selected.row_id,
				};
		   		
		   		var res = $http.post('remove-res-docs', dataObj);
				 res.success(function(data, status, headers, config) {
		 			$scope.message = data ;
		 			if($scope.message == true){
		 				 	
		 				 	 notif({
		 						  type: "success",
		 						  msg: messages.deletedsuccessfully,
		 						  position: "center",
		 						  multiline : true,
		 						  timeout: 6000
		 						});
		 				 	 $scope.resetResearchDocumentsData();
		 					 $scope.doctype='';
		 						$scope.doc_description='';
		 						$scope.language='';
		 						$scope.pages='';
		 						$scope.updateshow=false;
		 						$scope.cancelshow=false;
		 						$scope.addshow=true;
		 						$scope.researchDocument.$setPristine(true);
		 						$scope.genericMethod();			 				
		 			}else{
		 				 notif({
		 					  type: "error",
		 					  msg: messages.contactadmin,
		 					  position: "center",
		 					  multiline:true,
		 					  timeout: 6000
		 					});
		 			}
		 		});
				res.error(function(data, status, headers, config) {
					notif({
						  type: "error",
						  msg: mesaages.error,
						  position: "center",
						  multiline : true,
						  timeout: 6000
						});
				});	
   		    }
       	});
  	 }
  
   }
   
   
   /**
    * Funding Related code starts here
    */
   
 //get funding category
   $scope.getFundingCategory=function(){
         var dataObjForCourse = {
                       codeSet             :      "DOC_CATG_021"
           };
         var res = $http.post('getCodeSetByParentCodeSetextra', dataObjForCourse);
         res.success(function(data, status, headers, config) {
                $scope.fundingTypeCategory=[];
                $scope.fundingTypeCategory=data;
                       
         });
         res.error(function(data, status, headers, config) {
         });    
   }
   $scope.getFundingCategory();
   
 //Adding new record code starts here 
   $scope.addFundingDocumentsData=function(form){
	   var defer = $q.defer();
	   $scope.isFundingDocumentNameExists=false;
		for(var i in $scope.fundingDocument){
			if($scope.funding_doc_file!=undefined && $scope.funding_doc_file!=''){
				for(var j=0;j<$scope.funding_doc_file.length;j++){
					if($scope.funding_doc_file[j].name == $scope.fundingDocument[i].file_noHref){
						$scope.isFundingDocumentNameExists=true;
					}
				}
				
			}
		}
		if(!$scope.isFundingDocumentNameExists){
			  $scope.isSave=completionCheckService.saveForLaterCheck(messages.validateSaveForLaterForFunding,messages.validateCompletenessForFunding);
				$rootScope.researchFundingPercentage=$rootScope.saveForLatercount;
				if($scope.isSave ==false){
					   notif({
							  type: "error",
							  msg: messages.plzFillRedData,
							  position: "center",
							  multiline:true,
							  timeout: 6000
							});
					   defer.reject('false');
					   sessionStorage.setItem("isCorrect", 'false');
					   return false;
				   }
			   if($scope.funding_doc_file!=undefined && $scope.funding_doc_file!="" && $scope.funding_doc_file!="No file"){
					var file = $scope.funding_doc_file;
					var type=file;
					var array=[];
					var result="";
					var typesAllowedInUpload=messages.typeOfDocsToUpload;
					
					array=typesAllowedInUpload.split(",");
					
					for (var i = 0; i < file.length; i++) {
						for(var j=0;j<array.length;j++){
							if(file[i].type == array[j]){
								result="success";
								break ;
							}else{
								result="";
							}
						}
						
					}
					if(result!="success" && type!=""){
						 notif({
								type : "warning",
								msg : messages.uploadFilesWarning,
								position : "center",
								multiline: true,
								timeout : 6000,
								autohide: true
							});
						 defer.reject('false');
						 sessionStorage.setItem("isCorrect", 'false');
						 return false;
					} 	
					if($scope.funding_pages=="" || $scope.funding_pages==undefined || $scope.funding_pages==null){
						notif({
							type : "warning",
							msg : "Please enter document pages",
							position : "center",
							multiline: true,
							timeout : 6000,
							autohide: true
						});
						return false;
					} if($scope.funding_pages==0 || $scope.funding_pages<0){
						notif({
							type : "warning",
							msg : "Document pages should be greater than 0",
							position : "center",
							multiline: true,
							timeout : 6000,
							autohide: true
						});
						return false;
					}
					$scope.isSpecialChar= documentValidation.checkForSpecialCharMulti(file);
					$scope.isSpecialChar= documentValidation.checkForDocumentNameLenghtMulti(file);
					var size=file.size+"";
					var testsize=messages.maxsize; 
					if(Number(testsize)<Number(size)){
								testsize = testsize/1024;
								testsize=testsize/1024;
								notif({
									type : "warning",
									msg : messages.configSize+testsize+".MB",
									position : "center",
									multiline: true,
									timeout : 6000,
									autohide: true
								});
								defer.reject('false');
								sessionStorage.setItem("isCorrect", 'false');
							 return false; 			
							}
					
				 }else{
				 }
		   	angular.forEach(form, function(obj) {
		   		if (angular.isObject(obj)
		   				&& angular.isDefined(obj.$setDirty)) {
		   			obj.$setDirty();
		   		}
		   	})
		   	if (form.$valid) {
		   	var documentsData={
		   			document_type:			$scope.funding_doctype,
		   			document_description:	$scope.funding_doc_description,
		   			language:				$scope.funding_language,
		   			pages:					""+$scope.funding_pages,
		   			document_category:		"DOC_CATG_021",
		   			research_id:			""+$rootScope.researchApplicationId,
		   			no_of_documents:parseInt(($scope.funding_doc_file==undefined?1:$scope.funding_doc_file.length)),
		   	}
		   	

			var document_type_exits =$scope.funding_doctype;
			var document_message=mesaages.editrow;
			
			angular.forEach($scope.fundingDocument, function(value, key){
			      if(value.doc_type == document_type_exits){
			    	  document_message = document_type_exits + messages.researchupload;
			    	  document_type_exits = "";
			    	  
			      }
			   });
		   	
		   	
		   //	$.confirm({
			   // title: mesaages.areusure,
			   // content_box: document_message,
			   // confirm: function(){
			    	$scope.isFundingDocumentExists=false;
			    	
			    	/*for (var int = 0; int < $scope.fundingDocument.length; int++) {
						if($scope.fundingDocument[int].doc_type_codeSet == $scope.funding_doctype){
							$scope.isFundingDocumentExists=true;
						}
					}*/
			    	if(!$scope.isFundingDocumentExists){
			    		$scope.functionId = sessionStorage.getItem("functionId");
			            $scope.reqtHrdIdTemp= parseInt(sessionStorage.getItem("rfcHrdId"));
			            if(isNaN($scope.reqtHrdIdTemp)){
			            	$scope.reqtHrdIdTemp=1;
			            }
			            documentsData['functionId'] = $scope.functionId;
			            documentsData['reqtHrdId'] = $scope.reqtHrdIdTemp;
			    		 var res = $http.post('save-documents-data', documentsData);
			    	   	 res.success(function(data, status, headers, config) {
			    	   		 if(data>0){
			    	   			defer.resolve('true');
			    	   			sessionStorage.setItem("isCorrect", 'true');
			    	   			$scope.keyPressedForAutoSave = false;
			    	   			sessionStorage.setItem("dataChange", $scope.keyPressedForAutoSave);
			    	   			 var myCallback = function(){
			    	   				 if($scope.funding_doc_file != "" && $scope.funding_doc_file != undefined && $scope.funding_doc_file!="No file"){
			    	   					 $scope.fundingUploadFile("Funding_Doc").then(function(){

												if($scope.fundingresult){
													notif({
														type : "success",
														msg : messages.resDocUpdateSuccess,
														position : "center",
														multiline: true,
														timeout : 6000,
														autohide: true,
														
													});
													$scope.checkForErrorInApplication();
													$scope.NavigateToNextTab();
												}else if (typeof $scope.fundingresult === 'string' || $scope.fundingresult instanceof String){
										  			  if(data.search("The requested URL was rejected") > -1){
										 				  var supportId = data.match(/\d/g);
										 				  var errorObject = {
										  						title :"Error",
										  						content : '<p class="alert  text-center">Firewall getting blocked. <br />Please contact MRC with screen shot & Send a mail to <b>AbhathSupport@hamad.qa</b> with below support ID<br /><b>Your support ID is :'+supportId.join("")+'</b>.</p>'
										  				  };
										  				  ResearchApplicationModalService.openCustomAlertMessage(errorObject);
										  		 		
										 			  }
										 		  }else{
													notif({
														type : "error",
														msg : "Document Not uploaded. Contact Admin",
														position : "center",
														multiline: true,
														timeout : 6000,
														autohide: true,
														
													});
												}
			    	   					 });
			    	   				 	}else{
			    	   				 		$scope.genericMethod();
			    	   				 	}
			    	     			     }
			    	   			$scope.NavigateToNextTab();
			    	   			myCallback();
			    	   			$scope.resetFundingDocumentsData();
			    	   				$scope.fundingRelatedDocs.$setPristine(true);
			    	   				$scope.genericMethod();
			    	   				$scope.getBannerDataFromService();
			    	   		 }else if (typeof data === 'string' || data instanceof String){
					  			  if(data.search("The requested URL was rejected") > -1){
					 				  var supportId = data.match(/\d/g);
					 				  var errorObject = {
					  						title :"Error",
					  						content : '<p class="alert  text-center">Firewall getting blocked. <br />Please contact MRC with screen shot & Send a mail to <b>AbhathSupport@hamad.qa</b> with below support ID<br /><b>Your support ID is :'+supportId.join("")+'</b>.</p>'
					  				  };
					  				  ResearchApplicationModalService.openCustomAlertMessage(errorObject);
					  		 		
					 			  }
					 		  }else{
			    	   			 notif({
			    	   					type : "error",
			    	   					msg : messages.resDocSaveError,
			    	   					position : "center",
			    	   					multiline : true,
			    	   					timeout : 6000
			    	   				});
			    	   		 }
			    	   	 });
			    	   	 res.error(function(data, status, headers, config) {
			    	   		defer.reject();
			    	   		
			    	   	});
			    	}else if($scope.isFundingDocumentExists){
				    	notif({
							type : "warning",
							msg : messages.documentExists,
							position : "center",
							multiline : true,
							timeout : 6000
						});
				    }else{
				    	notif({
							type : "warning",
							msg : "Something went wrong please contact admin",
							position : "center",
							multiline : true,
							timeout : 6000
						});
				    }
			    //}
		   	//});
		   	}///if ends
		}else{
			notif({
				type : "warning",
				msg : messages.uploadFileAlreadyExists,
				position : "center",
				multiline : true,
				timeout : 6000
			});
			defer.reject('false');
			sessionStorage.setItem("isCorrect", 'false');
		}
		return defer.promise;
   }//adding new record code ends here
   //resetting values
   
   $scope.resetFundingDocumentsData=function(fundingRelatedDocs){
	   	highlightTableRowService.removeHighlight();
	    $scope.funding_doctype='';
	    angular.element("input[type='file']").val(null);
	    $scope.funding_file="";
	    $scope.funding_doc_description="";
		$scope.funding_language='';
		$scope.funding_doc_description='';
		$scope.funding_pages='';
		$scope.fundingUpdateshow=false;
		$scope.fundingAddshow=true;		
		$scope.fundingRelatedDocs.$setPristine(true);
   }
   
   //file upload code
   /**
    * file upload code
    */
   $scope.fundingUploadFile = function(documentType){
         var file = $scope.funding_doc_file;
         
         console.log('file is ' );
         console.dir(file);
         $scope.fileUploadAttempt=0;
         var uploadUrl = "upload-res-docs-multiple";
         return  $scope.uploadFileToUrl(file, uploadUrl,documentType).then(function(response){
             $scope.fundingresult = response.data;
             
         });
         
      };
      $scope.cancelFundinglUpdate=function(form){
   	   $scope.resetFundingDocumentsData();
   	   $scope.fundingUpdateshow=false;
   	   $scope.fundingCancelshow=false;
   	   $scope.fundingAddshow=true;
   	   	$scope.fundingRelatedDocs.$setPristine(true);
   	/* if($scope.fundingDocument == null){
			$("#funding_related_tab").css({ display: "block" });
		}else{
			$("#funding_related_tab").css({ display: "none" });
		}*/
      }
      
      //update code
      $scope.updateFundingDocuments=function(form){
    	  var defer = $q.defer();
    	$scope.isFundingDocumentNameExistsInUpdate=false;
  		for(var i in $scope.fundingDocument){
  			if($scope.funding_doc_file!=undefined && $scope.funding_doc_file!=''){
  				for(var j=0;j<$scope.funding_doc_file.length;j++){
  					if($scope.funding_doc_file[j].name == $scope.fundingDocument[i].file_noHref){
  	  	  				$scope.isFundingDocumentNameExistsInUpdate=true;
  	  	  			}	
  				}
  				
  			}
  		}
  		if($scope.funding_pages=="" || $scope.funding_pages==undefined || $scope.funding_pages==null){
			notif({
				type : "warning",
				msg : "Please enter document pages",
				position : "center",
				multiline: true,
				timeout : 6000,
				autohide: true
			});
			return false;
		} if($scope.funding_pages==0 || $scope.funding_pages<0){
			notif({
				type : "warning",
				msg : "Document pages should be greater than 0",
				position : "center",
				multiline: true,
				timeout : 6000,
				autohide: true
			});
			return false;
		}
  		if(!$scope.isFundingDocumentNameExistsInUpdate){
  			 var dataObj={
  	   			   document_type:			$scope.funding_doctype,
  	   				document_description:	$scope.funding_doc_description,
  	   				language:				$scope.funding_language,
  	   				pages:					""+$scope.funding_pages,
  	   				document_category:		"DOC_CATG_021",
  	   				research_id:			""+$rootScope.researchApplicationId,
  	   				research_doc_id:		""+$scope.row_id,
  	   			no_of_documents:parseInt(($scope.funding_doc_file==undefined?1:$scope.funding_doc_file.length)),
  	   	   }
  	   	var file = $scope.funding_doc_file;
  	   	if(file!=undefined && file!="" && file!="No file"){
  			var type=file;
  			var array=[];
  			var result="";
  			var typesAllowedInUpload=messages.typeOfDocsToUpload;
			
			array=typesAllowedInUpload.split(",");
  			
  			for(var i=0;i<file.length;i++){
  				for (var j = 0; j < array.length; j++) {
  	  				if(file[i].type == array[j]){
  	  					result="success";
  	  					break;
  	  				}else{
  	  				result="";
  	  				}
  	  			}
  			}
  			
  			if(result!="success"&& type!=""){
  				 notif({
  						type : "warning",
  						msg : messages.uploadFilesWarning,
  						position : "center",
  						multiline: true,
  						timeout : 6000,
  						autohide: true
  					});
  				 return false;
  				defer.reject('false');
  				sessionStorage.setItem("isCorrect", 'false');
  			}
  			$scope.isSpecialChar= documentValidation.checkForSpecialCharMulti(file);
  			$scope.isSpecialChar= documentValidation.checkForDocumentNameLenghtMulti(file);
			
  			var size=file.size+"";
  			var testsize=messages.maxsize; 
  			if(Number(testsize)<Number(size)){
  						testsize = testsize/1024;
  						testsize=testsize/1024;
  						notif({
  							type : "warning",
  							msg : messages.configSize+testsize+".MB",
  							position : "center",
  							multiline: true,
  							timeout : 6000,
  							autohide: true
  						});
  					 return false; 	
  					defer.reject('false');
  					sessionStorage.setItem("isCorrect", 'false');
  					}
  		 }else{
  		 }
  	   	
  	   	
  		   var document_type_exits = $scope.funding_doctype;
  			var document_message=mesaages.editrow;

  			angular.forEach($scope.fundingDocument, function(value, key){
  			      if(value.doc_type == document_type_exits && value.row_id!=$scope.row_id){
  			    	  document_message = document_type_exits + messages.researchupload;
  			    	  document_type_exits = "";
  			    	  
  			      }
  			   });

  	   	
  	   	  // $.confirm({
  	   		   // title: mesaages.areusure,
  	   		   // content_box: document_message,
  	   		    //confirm: function(){
  	   	   var file = $scope.funding_doc_file;
  	   	   angular.forEach(form, function(obj) {
  	   			if (angular.isObject(obj)
  	   					&& angular.isDefined(obj.$setDirty)) {
  	   				obj.$setDirty();
  	   			}
  	   		})
  	   		if (form.$valid) {
  	   		$scope.functionId = sessionStorage.getItem("functionId");
            $scope.reqtHrdIdTemp= parseInt(sessionStorage.getItem("rfcHrdId"));
            if(isNaN($scope.reqtHrdIdTemp)){
            	$scope.reqtHrdIdTemp=1;
            }
            dataObj['functionId'] = $scope.functionId;
            dataObj['reqtHrdId'] = $scope.reqtHrdIdTemp;
  	   	   var res = $http.post('save-documents-data', dataObj);
  	   		 res.success(function(data, status, headers, config) {
  	   			 if(data>0){
  	   			defer.resolve('true');
  	   		sessionStorage.setItem("isCorrect", 'true');
  	   		$scope.keyPressedForAutoSave = false;
  	   		sessionStorage.setItem("dataChange", $scope.keyPressedForAutoSave);
  	   				 var myCallback = function(){
  	   					 if($scope.funding_doc_file!=undefined && $scope.funding_doc_file!= "" && $scope.funding_doc_file!="No file"){
  	   						 $scope.fundingUploadFile("Funding_Doc").then(function(){
  	   						if($scope.fundingresult){
								notif({
									type : "success",
									msg : messages.resDocUpdateSuccess,
									position : "center",
									multiline: true,
									timeout : 6000,
									autohide: true,
									
								});
								$scope.checkForErrorInApplication();
								$scope.NavigateToNextTab();
							}else if (typeof $scope.fundingresult === 'string' || $scope.fundingresult instanceof String){
					  			  if(data.search("The requested URL was rejected") > -1){
					 				  var supportId = data.match(/\d/g);
					 				  var errorObject = {
					  						title :"Error",
					  						content : '<p class="alert  text-center">Firewall getting blocked. <br />Please contact MRC with screen shot & Send a mail to <b>AbhathSupport@hamad.qa</b> with below support ID<br /><b>Your support ID is :'+supportId.join("")+'</b>.</p>'
					  				  };
					  				  ResearchApplicationModalService.openCustomAlertMessage(errorObject);
					  		 		
					 			  }
					 		  }else{
								notif({
									type : "error",
									msg : "Document Not uploaded. Contact Admin",
									position : "center",
									multiline: true,
									timeout : 6000,
									autohide: true,
									
								});
							}
  	   						 });
  	   					 	}else{
  	   					 		$scope.genericMethod();
  	   					 	}
  	   	  			     }
  	   				 $scope.NavigateToNextTab();
  	   				myCallback();
  	   				$scope.resetFundingDocumentsData();
  	   				$scope.fundingUpdateshow=false;
  	   				$scope.fundingCancelshow=false;
  	   				$scope.fundingAddshow=true;
  	   				$scope.fundingRelatedDocs.$setPristine(true);
  	   				$scope.updateFundingForm=false;
  	   				$scope.genericMethod();
  	   				$scope.getBannerDataFromService();
  	   			 }else if (typeof data === 'string' || data instanceof String){
		  			  if(data.search("The requested URL was rejected") > -1){
		 				  var supportId = data.match(/\d/g);
		 				  var errorObject = {
		  						title :"Error",
		  						content : '<p class="alert  text-center">Firewall getting blocked. <br />Please contact MRC with screen shot & Send a mail to <b>AbhathSupport@hamad.qa</b> with below support ID<br /><b>Your support ID is :'+supportId.join("")+'</b>.</p>'
		  				  };
		  				  ResearchApplicationModalService.openCustomAlertMessage(errorObject);
		  		 		
		 			  }
		 		  }else{
  	   				 notif({
  	   						type : "error",
  	   						msg : messages.resDocUpdateError,
  	   						position : "center",
  	   						multiline : true,
  	   						timeout : 6000
  	   					});
	  	   			defer.reject('false');
	  	   			sessionStorage.setItem("isCorrect", 'false');
  	   			 }
  	   			
  	   				
  	   		 });
  	   		 res.error(function(data, status, headers, config) {
  	   		});	
  	   		}
  	     // }
  	  // });
  		}else{
  			notif({
						type : "error",
						msg : messages.uploadFileAlreadyExists,
						position : "center",
						multiline : true,
						timeout : 6000
					});
  			defer.reject('false');
  			sessionStorage.setItem("isCorrect", 'false');
  		}
  		return defer.promise;
      }
      //update code ends
      
      $scope.editFundingDocument=function( row,index){

       	
        	$.confirm({
    		    title: mesaages.areusure,
    		    content_box: mesaages.editrow,
    		    confirm: function(){
    		    	$scope.fundingUpdateshow=true;
    		   	$scope.fundingCancelshow=true;
    		   	$scope.fundingAddshow=false;
    		    	 $scope.selected = row;
    				 $scope.indexvalue=index;
    				$scope.funding_doctype=$scope.selected.doc_type_codeSet;
    				$scope.funding_doc_description=$scope.selected.doc_desc;
    				$scope.funding_language=$scope.selected.language;
    				$scope.funding_pages=$scope.selected.pages;
    				//$scope.funding_doc_file= $scope.selected.file;
    				$scope.funding_doc_file2= $scope.selected.file_noHref;
    				$scope.row_id= $scope.selected.row_id;
    				 $scope.updateFundingForm=true;
    				completionCheckService.resetField(messages.validateSaveForLater);
    				$scope.$apply();
    				if ($scope.amdSerialNo > 0 && sessionStorage.getItem("workItemSubCode")=="AMEND_MODE") {
    		    		$scope.subTableId=[];
    	            	$scope.subTableId.push("expenseDocumentTable");
    	            	$rootScope.highelightFieldForAmendment($scope.selected.row_id,$scope.subTableId,messages.validateSaveForLaterForFunding);
                    }
    				$("#funding_related_tab").css({ display: "block" });
    				$( ".back-to-top" ).trigger( "click" );
    		    }
        	});
      }
      
      $scope.removeFundingDocument=function( row,index){

       	$scope.isAlloedToDelete=true;
      	 $.each($scope.dataInsertedByWorkFlow,function(key,value){
      		 if(row.row_id==value.docId){
      			 notif({
						  type: "warning",
						  msg: messages.deleteRestrict,
						  position: "center",
						  multiline : true,
						  timeout: 6000
						});
      			 $scope.isAlloedToDelete=false;
      			 return false;
      		 }
      	 });
      	 if($scope.isAlloedToDelete==true){
	  			$.confirm({
   		    title: mesaages.areusure,
   		    content_box: mesaages.deleterow,
   		    confirm: function(){
   		    	$scope.showorhideupdate=true;
   		    	$scope.showorhideadd=false;
   		    	 $scope.selected = row;
	           	var dataObj={
	           			research_doc_id:		""+$scope.selected.row_id,
				};
		   		
		   		var res = $http.post('remove-res-docs', dataObj);
				 res.success(function(data, status, headers, config) {
		 			$scope.message = data ;
		 			if($scope.message == true){
		 				 	
		 				 	 notif({
		 						  type: "success",
		 						  msg: messages.deletedsuccessfully,
		 						  position: "center",
		 						  multiline : true,
		 						  timeout: 6000
		 						});
		 				 	$scope.resetFundingDocumentsData();
		 	   				$scope.fundingUpdateshow=false;
		 	   				$scope.fundingCancelshow=false;
		 	   				$scope.fundingAddshow=true;
		 	   				$scope.fundingRelatedDocs.$setPristine(true);
		 	   				$scope.genericMethod();
		 			}else{
		 				 notif({
		 					  type: "error",
		 					  msg: messages.contactadmin,
		 					  position: "center",
		 					  multiline:true,
		 					  timeout: 6000
		 					});
		 			}
		 		});
				res.error(function(data, status, headers, config) {
					notif({
						  type: "error",
						  msg: mesaages.error,
						  position: "center",
						  multiline : true,
						  timeout: 6000
						});
				});	
   		    }
       	});
      	 }
           	  
      }
   //Funding Related code ends here

      //Legal related code starts here
      
      $scope.getLegalCategory=function(){
          var dataObjForCourse = {
                        codeSet             :      "DOC_CATG_031"
            };
          var res = $http.post('getCodeSetByParentCodeSetextra', dataObjForCourse);
          res.success(function(data, status, headers, config) {
                 $scope.legalTypeCategory=[];
                 $scope.legalTypeCategory=data;
                        
          });
          res.error(function(data, status, headers, config) {
          });    
    }
    $scope.getLegalCategory();
  //Adding new record code starts here 
    $scope.addLegalDocumentsData=function(form){
    	var defer = $q.defer();
    	$scope.isLegalDocumentNameExists=false;
  		for(var i in $scope.legalDocument){
  			if($scope.legal_doc_file!=undefined && $scope.legal_doc_file!=''){
  				for(var j=0;j<$scope.legal_doc_file.length;j++){
  					if($scope.legal_doc_file[j].name == $scope.legalDocument[i].file_noHref){
  	  	  				$scope.isLegalDocumentNameExists=true;
  	  	  			}
  				}
  				
  			}
  		}
  		if(!$scope.isLegalDocumentNameExists){
  			$scope.isSave=completionCheckService.saveForLaterCheck(messages.validateSaveForLaterForLegal,messages.validateCompletenessForLegal);
  			$rootScope.researchLegalPercentage=$rootScope.saveForLatercount;
  			if($scope.isSave ==false){
  				   notif({
  						  type: "error",
  						  msg: messages.plzFillRedData,
  						  position: "center",
  						  multiline:true,
  						  timeout: 6000
  						});
  				 defer.reject('false');
  				sessionStorage.setItem("isCorrect", 'false');
  				   return false;
  			   }
  			 var file = $scope.legal_doc_file;
  			if(file!=undefined && file!="" && file!="No file"){
  				var type=file;
  				var array=[];
  				var result="";
  				var typesAllowedInUpload=messages.typeOfDocsToUpload;
  				
  				array=typesAllowedInUpload.split(",");
  				
  				for (var i = 0; i < file.length; i++) {
  					for(var j=0;j<array.length;j++){
  						if(file[i].type == array[j]){
  	  						result="success";
  	  						break ;
  	  					}else{
  	  					result="";
  	  					}
  					}
  					
  				}
  				if(result!="success" && type!=""){
  					 notif({
  							type : "warning",
  							msg : messages.uploadFilesWarning,
  							position : "center",
  							multiline: true,
  							timeout : 6000,
  							autohide: true
  						});
  					defer.reject('false');
  					sessionStorage.setItem("isCorrect", 'false');
  					 return false;
  				}
  				$scope.isSpecialChar= documentValidation.checkForSpecialCharMulti(file);
  				$scope.isSpecialChar= documentValidation.checkForDocumentNameLenghtMulti(file);

  				var size=file.size+"";
  				var testsize=messages.maxsize; 
  				if(Number(testsize)<Number(size)){
  							testsize = testsize/1024;
  							testsize=testsize/1024;
  							notif({
  								type : "warning",
  								msg : messages.configSize+testsize+".MB",
  								position : "center",
  								multiline: true,
  								timeout : 6000,
  								autohide: true
  							});
  							defer.reject('false');
  							sessionStorage.setItem("isCorrect", 'false');
  						 return false; 			
  						}
  			 }else{
  			 }
  			
  			if($scope.legal_pages=="" || $scope.legal_pages==undefined || $scope.legal_pages==null){
				notif({
					type : "warning",
					msg : "Please enter document pages",
					position : "center",
					multiline: true,
					timeout : 6000,
					autohide: true
				});
				return false;
			} if($scope.legal_pages==0 || $scope.legal_pages<0){
				notif({
					type : "warning",
					msg : "Document pages should be greater than 0",
					position : "center",
					multiline: true,
					timeout : 6000,
					autohide: true
				});
				return false;
			}
  	    	angular.forEach(form, function(obj) {
  	    		if (angular.isObject(obj)
  	    				&& angular.isDefined(obj.$setDirty)) {
  	    			obj.$setDirty();
  	    		}
  	    	})
  	    	if (form.$valid) {
  	    	var documentsData={
  	    			document_type:			$scope.legal_doctype,
  	    			document_description:	$scope.legal_doc_description,
  	    			language:				$scope.legal_language,
  	    			pages:					""+$scope.legal_pages,
  	    			document_category:		"DOC_CATG_031",
  	    			research_id:			""+$rootScope.researchApplicationId,
  	    			no_of_documents:parseInt(($scope.legal_doc_file==undefined?1:$scope.legal_doc_file.length)),
  	    	}
  	    	var document_type_exits = $scope.legal_doctype;
  	    	var document_message=mesaages.editrow;
  	    	angular.forEach($scope.legalDocument, function(value, key){
  	    	      if(value.doc_type == document_type_exits){
  	    	    	  document_message = document_type_exits + messages.researchupload;
  	    	    	  document_type_exits = "";
  	    	    	  
  	    	      }
  	    	   });
  	    	//$.confirm({
  			  //  title: mesaages.areusure,
  			   // content_box: document_message,
  			   // confirm: function(){
  			    	$scope.isLegalDocumentExists=false;
  			    	/*for (var int = 0; int < $scope.legalDocument.length; int++) {
  						if($scope.legalDocument[int].doc_type_codeSet == $scope.legal_doctype){
  							$scope.isLegalDocumentExists=true;
  						}
  					}*/
  			    	if(!$scope.isLegalDocumentExists){
  			    		$scope.functionId = sessionStorage.getItem("functionId");
			            $scope.reqtHrdIdTemp= parseInt(sessionStorage.getItem("rfcHrdId"));
			            if(isNaN($scope.reqtHrdIdTemp)){
			            	$scope.reqtHrdIdTemp=1;
			            }
			            documentsData['functionId'] = $scope.functionId;
			            documentsData['reqtHrdId'] = $scope.reqtHrdIdTemp;
  			    		 var res = $http.post('save-documents-data', documentsData);
  			        	 res.success(function(data, status, headers, config) {
  			        		 if(data>0){
  			        			defer.resolve('true');
  			        			sessionStorage.setItem("isCorrect", 'true');
  			        			$scope.keyPressedForAutoSave = false;
  			        			sessionStorage.setItem("dataChange", $scope.keyPressedForAutoSave);
  			        			 var myCallback = function(){
  			        				 if($scope.legal_doc_file != "" && $scope.legal_doc_file != undefined && $scope.legal_doc_file!="No file"){
  			        					 $scope.legalUploadFile("Legal_Doc").then(function(){
  			        						 
  			        						if($scope.legalResult){
												notif({
													type : "success",
													msg : messages.resDocUpdateSuccess,
													position : "center",
													multiline: true,
													timeout : 6000,
													autohide: true,
													
												});
												$scope.checkForErrorInApplication();
												$scope.NavigateToNextTab();
											}else if (typeof $scope.legalResult === 'string' || $scope.legalResult instanceof String){
									  			  if(data.search("The requested URL was rejected") > -1){
									 				  var supportId = data.match(/\d/g);
									 				  var errorObject = {
									  						title :"Error",
									  						content : '<p class="alert  text-center">Firewall getting blocked. <br />Please contact MRC with screen shot & Send a mail to <b>AbhathSupport@hamad.qa</b> with below support ID<br /><b>Your support ID is :'+supportId.join("")+'</b>.</p>'
									  				  };
									  				  ResearchApplicationModalService.openCustomAlertMessage(errorObject);
									  		 		
									 			  }
									 		  }else{
												notif({
													type : "error",
													msg : "Document Not uploaded. Contact Admin",
													position : "center",
													multiline: true,
													timeout : 6000,
													autohide: true,
													
												});
											}

  			        					 });
  			        				 	}else{
  			        				 		$scope.genericMethod();
  			        				 	}
  			          			     }
  			        			$scope.NavigateToNextTab();
  			        			 myCallback();
  			        			 $scope.resetLegalDocumentsData();
  			        				$scope.legalRelatedDocs.$setPristine(true);
  			        				$scope.genericMethod();
  			        				$scope.getBannerDataFromService();
  			        		 }else if (typeof data === 'string' || data instanceof String){
					  			  if(data.search("The requested URL was rejected") > -1){
					 				  var supportId = data.match(/\d/g);
					 				  var errorObject = {
					  						title :"Error",
					  						content : '<p class="alert  text-center">Firewall getting blocked. <br />Please contact MRC with screen shot & Send a mail to <b>AbhathSupport@hamad.qa</b> with below support ID<br /><b>Your support ID is :'+supportId.join("")+'</b>.</p>'
					  				  };
					  				  ResearchApplicationModalService.openCustomAlertMessage(errorObject);
					  		 		
					 			  }
					 		  }else{
  			        			 notif({
  			        					type : "error",
  			        					msg : messages.resDocSaveError,
  			        					position : "center",
  			        					multiline : true,
  			        					timeout : 6000
  			        				});
  			        		 }
  			        		
  			        			
  			        	 });
  			        	 res.error(function(data, status, headers, config) {
  			        	});
  			    	}else if($scope.isLegalDocumentExists){
  				    	notif({
  							type : "warning",
  							msg : messages.documentExists,
  							position : "center",
  							multiline : true,
  							timeout : 6000
  						});
  				    }else{
  				    	notif({
  							type : "warning",
  							msg : "Something went wrong please contact admin",
  							position : "center",
  							multiline : true,
  							timeout : 6000
  						});
  				    }
  	    	
  			    //}
  	    	//});
  	    	}else{
  	    		defer.reject('false');
  	    		sessionStorage.setItem("isCorrect", 'false');
  	    	}
  		}else{
  			notif({
					type : "warning",
					msg : messages.uploadFileAlreadyExists,
					position : "center",
					multiline : true,
					timeout : 6000
				});
  			defer.reject('false');
  			sessionStorage.setItem("isCorrect", 'false');
  		}
  		return defer.promise;
  		
    	
    }//adding new record code ends here
    /**
     * file upload code
     */
    $scope.legalUploadFile = function(documentType){
          var file = $scope.legal_doc_file;
          
          console.log('file is ' );
          console.dir(file);
          $scope.fileUploadAttempt=0;
          var uploadUrl = "upload-res-docs-multiple";
          return  $scope.uploadFileToUrl(file, uploadUrl,documentType).then(function(response){
              $scope.legalResult = response.data;
              
          });
          
       };
       $scope.institutionalUploadFile = function(documentType){
           var file = $scope.institutional_doc_file;
           var uploadUrl = "upload-res-docs-multiple";
		   $scope.fileUploadAttempt=0;
           //$scope.uploadFileToUrl(file, uploadUrl,$scope,dcoumentType);
           return  $scope.uploadFileToUrl(file, uploadUrl,documentType).then(function(response){
               $scope.institutionalResult = response.data;
               
           });
           
        };
        $scope.regulatoryUploadFile = function(documentType){
            var file = $scope.regulatory_doc_file;
            var uploadUrl = "upload-res-docs-multiple";
			$scope.fileUploadAttempt=0;
            //$scope.uploadFileToUrl(file, uploadUrl,$scope,dcoumentType);
            return  $scope.uploadFileToUrl(file, uploadUrl,documentType).then(function(response){
                $scope.regulatoryResult = response.data;
                
            });
            
         };
       //resetting values
         $scope.adHocUploadFile = function(documentType){
             var file = $scope.ad_hoc_doc_file;
             var uploadUrl = "upload-res-docs-multiple";
			 $scope.fileUploadAttempt=0;
             //$scope.uploadFileToUrl(file, uploadUrl,$scope,dcoumentType);
             return  $scope.uploadFileToUrl(file, uploadUrl,documentType).then(function(response){
                 $scope.adHoResult = response.data;
                 
             });
             
          };
          $scope.resetAdHocDocumentsData=function(adHocRelatedDocs){
      	   	highlightTableRowService.removeHighlight();
      	    $scope.ad_hoc_doctype='';
      	   // document.getElementById("legal_file").value = "";
      	    angular.element("input[type='file']").val(null);
      	    $scope.ad_hoc_doc_file="";
  			$scope.ad_hoc_doc_description='';
      		$scope.ad_hoc_doc_language='';
      		$scope.ad_hoc_doc_pages='';
      		$scope.adHocDocmentForm.$setPristine(true);
      		$scope.legalAddshow=true;
      		$scope.legalUpdateshow=false;
      		// $scope.clear();
         }
       $scope.resetLegalDocumentsData=function(legalRelatedDocs){
    	   	highlightTableRowService.removeHighlight();
    	    $scope.legal_doctype='';
    	   // document.getElementById("legal_file").value = "";
    	    angular.element("input[type='file']").val(null);
    	    $scope.legal_file="";
			$scope.legal_doc_description='';
    		$scope.legal_language='';
    		$scope.legal_pages='';
    		$scope.legalRelatedDocs.$setPristine(true);
    		$scope.legalAddshow=true;
    		$scope.legalUpdateshow=false;
    		$scope.legal_doc_description="";
    		// $scope.clear();
       }
       //cancel function
       $scope.cancelLegalUpdate=function(form){
    	   $scope.resetLegalDocumentsData();
    	   $scope.legalUpdateshow=false;
    	   $scope.legalCancelshow=false;
    	   $scope.legalAddshow=true;
    	   	$scope.legalRelatedDocs.$setPristine(true);
    		if($scope.legalDocument == null){
    			$("#legal_related_tab").css({ display: "block" });
    		}else{
    			$("#legal_related_tab").css({ display: "none" });
    		}
       }
       //update code
       $scope.updateLegalDocuments=function(form){
    	   var defer = $q.defer();
    	   $scope.checkForPercentage=completionCheckService.percentageCalculationForDocument(completeValidation.percentageLegalRelated);
			if($scope.checkForPercentage){
				$rootScope.researchDocumentPercentage=$rootScope.percentageCompletionCount;
			}
    	   $scope.isLegalDocumentNameExistsInUpdate=false;
     		for(var i in $scope.legalDocument){
     			for(var j=0;j<$scope.legal_doc_file;j++){
     				if($scope.legal_doc_file[j].name == $scope.legalDocument[i].file_noHref){
         				$scope.isLegalDocumentNameExistsInUpdate=true;
         			}
     			}
     			
     		}
     		if($scope.legal_pages=="" || $scope.legal_pages==undefined || $scope.legal_pages==null){
				notif({
					type : "warning",
					msg : "Please enter document pages",
					position : "center",
					multiline: true,
					timeout : 6000,
					autohide: true
				});
				return false;
			} if($scope.legal_pages==0 || $scope.legal_pages<0){
				notif({
					type : "warning",
					msg : "Document pages should be greater than 0",
					position : "center",
					multiline: true,
					timeout : 6000,
					autohide: true
				});
				return false;
			}
     		if(!$scope.isLegalDocumentNameExistsInUpdate){
     			  var dataObj={
     	    			   document_type:			$scope.legal_doctype,
     	    				document_description:	$scope.legal_doc_description,
     	    				language:				$scope.legal_language,
     	    				pages:					""+$scope.legal_pages,
     	    				document_category:		"Legal related",
     	    				research_id:			""+$rootScope.researchApplicationId,
     	    				research_doc_id:		""+$scope.row_id,
     	    				no_of_documents:parseInt(($scope.legal_doc_file==undefined?1:$scope.legal_doc_file.length)),
     	    	   }
     	    	   var file = $scope.legal_doc_file;
     	    	   if(file!=undefined && file!="" && file!="No file"){
     	      			var type=file;
     	      			var array=[];
     	      			var result="";
     	      			var typesAllowedInUpload=messages.typeOfDocsToUpload;
     	      			
     	      			array=typesAllowedInUpload.split(",");
     	      			
     	      			for (var i = 0; i < file.length; i++) {
     	      				for(var j=0;j<array.length;j++){
     	      					if(file[i].type == array[j]){
         	      					result="success";
         	      					break ;
         	      				}else{
         	      					result="";
         	      				}
     	      				}
     	      				
     	      			}
     	      			if(result!="success" &&  type!=""){
     	      				 notif({
     	      						type : "warning",
     	      						msg : messages.uploadFilesWarning,
     	      						position : "center",
     	      						multiline: true,
     	      						timeout : 6000,
     	      						autohide: true
     	      					});
     	      				defer.reject('false');
     	      				sessionStorage.setItem("isCorrect", 'false');
     	      				 return false;
     	      			}
     	      			
     	      			$scope.isSpecialChar= documentValidation.checkForSpecialCharMulti(file);
     	      			$scope.isSpecialChar= documentValidation.checkForDocumentNameLenghtMulti(file);
     	      			
     	      			var testsize=messages.maxsize; 
     	      			for(var k=0;k<file.length;k++){
     	      				var size=file[k].size+"";
     	      				if(Number(testsize)<Number(size)){
 	      						testsize = testsize/1024;
 	      						testsize=testsize/1024;
 	      						notif({
 	      							type : "warning",
 	      							msg : messages.configSize+testsize+".MB",
 	      							position : "center",
 	      							multiline: true,
 	      							timeout : 6000,
 	      							autohide: true
 	      						});
 	      						defer.reject('false');
 	      						sessionStorage.setItem("isCorrect", 'false');
 	      					 return false; 			
 	      					}
     	      				
     	      				
 	      		 }
     	      			}
     	      			
     	    	   
     	    	   var document_type_exits =$scope.legal_doctype;
     	   		var document_message=mesaages.editrow;

     	   		angular.forEach($scope.legalDocument, function(value, key){
     	   			  
     	   			   if(value.doc_type == document_type_exits && value.row_id!=$scope.row_id){
     	   		    	  document_message = document_type_exits + messages.researchupload;
     	   		    	  document_type_exits = "";
     	   		    	  
     	   		      }
     	   		   });
     	    	   
     	       	   
     	    	   $.confirm({
     	    		    title: mesaages.areusure,
     	    		    content_box: document_message,
     	    		    confirm: function(){
     	    	   var file = $scope.legal_doc_file;
     	    	   /*if(file!=undefined && file!="" && file!="No file"){
     	   			var type=file.type;
     	   			var array=[];
     	   			var result="";
     	   			var typesAllowedInUpload=messages.typeOfDocsToUpload;
     	   			
     	   			array=typesAllowedInUpload.split(",");
     	   			
     	   			for (var i = 0; i < array.length; i++) {
     	   				if(type == array[i]){
     	   					result="success";
     	   				}
     	   			}
     	   			if(result!="success"){
     	   				 notif({
     	   						type : "warning",
     	   						msg : messages.uploadFilesWarning,
     	   						position : "center",
     	   						multiline: true,
     	   						timeout : 3000,
     	   						autohide: true
     	   					});
     	   				 return false;
     	   			}
     	   		 }else{
     	   		 }*/
     	    	   angular.forEach(form, function(obj) {
     	    			if (angular.isObject(obj)
     	    					&& angular.isDefined(obj.$setDirty)) {
     	    				obj.$setDirty();
     	    			}
     	    		})
     	    		if (form.$valid) {
     	    			$scope.functionId = sessionStorage.getItem("functionId");
			            $scope.reqtHrdIdTemp= parseInt(sessionStorage.getItem("rfcHrdId"));
			            if(isNaN($scope.reqtHrdIdTemp)){
			            	$scope.reqtHrdIdTemp=1;
			            }
			            dataObj['functionId'] = $scope.functionId;
			            dataObj['reqtHrdId'] = $scope.reqtHrdIdTemp;
     	    	   var res = $http.post('save-documents-data', dataObj);
     	    		 res.success(function(data, status, headers, config) {
     	    			 if(data>0){
     	    				defer.resolve('true');
     	    				sessionStorage.setItem("isCorrect", 'true');
     	    				$scope.keyPressedForAutoSave = false;
     	    				sessionStorage.setItem("dataChange", $scope.keyPressedForAutoSave);
     	    				 var myCallback = function(){
     	    					 if($scope.legal_doc_file!=undefined && $scope.legal_doc_file!= "" && $scope.legal_doc_file!="No file"){
     	    						 $scope.legalUploadFile("Legal_Doc").then(function(){
     	    							if($scope.legalResult){
											notif({
												type : "success",
												msg : messages.resDocUpdateSuccess,
												position : "center",
												multiline: true,
												timeout : 6000,
												autohide: true,
												
											});
											$scope.checkForErrorInApplication();
											$scope.NavigateToNextTab();
										}else if (typeof $scope.legalResult === 'string' || $scope.legalResult instanceof String){
								  			  if(data.search("The requested URL was rejected") > -1){
								 				  var supportId = data.match(/\d/g);
								 				  var errorObject = {
								  						title :"Error",
								  						content : '<p class="alert  text-center">Firewall getting blocked. <br />Please contact MRC with screen shot & Send a mail to <b>AbhathSupport@hamad.qa</b> with below support ID<br /><b>Your support ID is :'+supportId.join("")+'</b>.</p>'
								  				  };
								  				  ResearchApplicationModalService.openCustomAlertMessage(errorObject);
								  		 		
								 			  }
								 		  }else{
											notif({
												type : "error",
												msg : "Document Not uploaded. Contact Admin",
												position : "center",
												multiline: true,
												timeout : 6000,
												autohide: true,
												
											});
										}
     	    						 });
     	    					 	}else{
     	    					 		$scope.genericMethod();
     	    					 	}
     	    	  			     }
     	    				$scope.NavigateToNextTab();
     	    				 myCallback();
     	    				$scope.resetLegalDocumentsData();
     	    				$scope.legalUpdateshow=false;
     	    				$scope.legalCancelshow=false;
     	    				$scope.legalAddshow=true;
     	    				$scope.legalRelatedDocs.$setPristine(true);
     	    				$scope.updateLegalForm=false;
     	    				$scope.genericMethod();
     	    				$scope.getBannerDataFromService();
     	    			 }else if (typeof data === 'string' || data instanceof String){
				  			  if(data.search("The requested URL was rejected") > -1){
				 				  var supportId = data.match(/\d/g);
				 				  var errorObject = {
				  						title :"Error",
				  						content : '<p class="alert  text-center">Firewall getting blocked. <br />Please contact MRC with screen shot & Send a mail to <b>AbhathSupport@hamad.qa</b> with below support ID<br /><b>Your support ID is :'+supportId.join("")+'</b>.</p>'
				  				  };
				  				  ResearchApplicationModalService.openCustomAlertMessage(errorObject);
				  		 		
				 			  }
				 		  }else{
     	    				 notif({
     	    						type : "error",
     	    						msg : messages.resDocUpdateError,
     	    						position : "center",
     	    						multiline : true,
     	    						timeout : 6000
     	    					});
     	    				defer.reject('false');
     	    				sessionStorage.setItem("isCorrect", 'false');
     	    			 }
     	    			
     	    				
     	    		 });
     	    		 res.error(function(data, status, headers, config) {
     	    			defer.reject('false');
     	    			sessionStorage.setItem("isCorrect", 'false');
     	    		});	
     	    		}else{
     	    			defer.reject('false');
     	    			sessionStorage.setItem("isCorrect", 'false');
     	    		}
     	       }
     	    });
     		}else{
     			notif({
						type : "error",
						msg : messages.uploadFileAlreadyExists,
						position : "center",
						multiline : true,
						timeout : 6000
					});
     			defer.reject('false');
     			sessionStorage.setItem("isCorrect", 'false');
     		}
     		return defer.promise;
       }
       //update code ends
       
       $scope.editLegalDocument=function(row,index){
	         	$.confirm({
	     		    title: mesaages.areusure,
	     		    content_box: mesaages.editrow,
	     		    confirm: function(){
	     		    	$scope.legalUpdateshow=true;
	     		   	$scope.legalCancelshow=true;
	     		   	$scope.legalAddshow=false;
	     		    	 $scope.selected = row;
	     				 $scope.indexvalue=index;
	     				$scope.legal_doctype=$scope.selected.doc_type_codeSet;
	     				$scope.legal_doc_description=$scope.selected.doc_desc;
	     				$scope.legal_language=$scope.selected.language;
	     				$scope.legal_pages=$scope.selected.pages;
	     				//$scope.legal_doc_file= $scope.selected.file;
	     				$scope.legal_doc_file_nohref= $scope.selected.file_noHref;
	     				$scope.row_id= $scope.selected.row_id;
	     				$scope.updateLegalForm=true;
	     			completionCheckService.resetField(messages.validateSaveForLater);
	     				$scope.$apply();
	     				if ($scope.amdSerialNo > 0 && sessionStorage.getItem("workItemSubCode")=="AMEND_MODE") {
	    		    		$scope.subTableId=[];
	    	            	$scope.subTableId.push("expenseDocumentTable");
	    	            	$rootScope.highelightFieldForAmendment($scope.selected.row_id,$scope.subTableId,messages.validateSaveForLaterForLegal);
	                    }
	     			$("#legal_related_tab").css({ display: "block" });
	     			$( ".back-to-top" ).trigger( "click" );
	     		    }
	         	});
	        
       }
       
       $scope.removeLegalDocument=function(row,index){

	        	$scope.isAlloedToDelete=true;
       	 $.each($scope.dataInsertedByWorkFlow,function(key,value){
       		 if(row.row_id==value.docId){
       			 notif({
						  type: "warning",
						  msg: messages.deleteRestrict,
						  position: "center",
						  multiline : true,
						  timeout: 6000
						});
       			 $scope.isAlloedToDelete=false;
       			 return false;
       		 }
       	 });
       	 if($scope.isAlloedToDelete==true){
		  			$.confirm({
	    		    title: mesaages.areusure,
	    		    content_box: mesaages.deleterow,
	    		    confirm: function(){
	    		    	$scope.showorhideupdate=true;
	    		    	$scope.showorhideadd=false;
	    		    	 $scope.selected = row;
		           	var dataObj={
		           			research_doc_id:		""+$scope.selected.row_id,
					};
			   		
			   		var res = $http.post('remove-res-docs', dataObj);
					 res.success(function(data, status, headers, config) {
			 			$scope.message = data ;
			 			if($scope.message == true){
			 				 	
			 				 	 notif({
			 						  type: "success",
			 						  msg: messages.deletedsuccessfully,
			 						  position: "center",
			 						  multiline : true,
			 						  timeout: 6000
			 						});
			 				 $scope.resetLegalDocumentsData();
		    				$scope.legalUpdateshow=false;
		    				$scope.legalCancelshow=false;
		    				$scope.legalAddshow=true;
		    				$scope.legalRelatedDocs.$setPristine(true);
		    				$scope.genericMethod();
			 			}else{
			 				 notif({
			 					  type: "error",
			 					  msg: messages.contactadmin,
			 					  position: "center",
			 					  multiline:true,
			 					  timeout: 6000
			 					});
			 			}
			 		});
					res.error(function(data, status, headers, config) {
						notif({
							  type: "error",
							  msg: mesaages.error,
							  position: "center",
							  multiline : true,
							  timeout: 6000
							});
					});	
	    		    }
	        	});
       	 }
	        
       }
       
       $scope.exitResearchDocuments = function() {
    	   $.confirm({
   		    title: mesaages.areusure,
   		    content_box: mesaages.signupconfirm,
	   		 confirm: function(){
					location.href = "#/home-page-sid";
				
		    }
   		});
		}
       $scope.exitFundingDocuments = function() {
    	   $.confirm({
   		    title: mesaages.areusure,
   		    content_box: mesaages.signupconfirm,
	   		 confirm: function(){
					location.href = "#/home-page-sid";
				
		    }
   		});
		}
       $scope.exitLegalDocuments = function() {
    	   $.confirm({
   		    title: mesaages.areusure,
   		    content_box: mesaages.signupconfirm,
		   		 confirm: function(){
						location.href = "#/home-page-sid";
					
			    }
   		});
		}
       $scope.submit=function(nextOrPrevValue){
    	   var defer = $q.defer();
    	   $scope.nextOrPrevValue=nextOrPrevValue;
    	   
    	   
    	   if( $scope.isResearchDocument){
        	  
    		   if(!$scope.updateResearchForm){
    			   $q.all($scope.addResearchDocumentsData($scope.researchDocument)).then(function(state) {
    				   return defer.promise;
    			   });
    		   
    		   }
    		   else{
    			   $q.all($scope.updateDocumentation($scope.researchDocument)).then(function(state) {
    				   return defer.promise;
    			   });
    		   }
        	   }
        	   if($scope.isFundingRelatedDocsForm){
        		   
        		   if(!$scope.updateFundingForm)
        		   {
        			   $q.all($scope.addFundingDocumentsData($scope.fundingRelatedDocs)).then(function(state) {
        				   return defer.promise;
        			   });
        			   			
        		   }else{
        			   $q.all($scope.updateFundingDocuments($scope.fundingRelatedDocs)).then(function(state) {
        				   return defer.promise;
        			   });
        		   }
        	   }
        	   if($scope.isLegalRelatedDocsForm){
        		   if(!$scope.updateLegalForm){
        			   $q.all($scope.addLegalDocumentsData($scope.legalRelatedDocs)).then(function(state) {
        				   return defer.promise;
        			   });
        		   }
        		   else{
        			   $q.all($scope.updateLegalDocuments($scope.legalRelatedDocs)).then(function(state) {
        				   return defer.promise;
        			   });
        		   }
        	   }
        	   if($scope.isinstApprovalDocForm){
        		   if(!$scope.updateInstitutionalForm){
        			   $q.all($scope.addInstitutionalDocumentsData()).then(function(state) {
        				   return defer.promise;
        			   });
        		   }
        		   else{
        			   $q.all($scope.updateInstitutional()).then(function(state) {
        				   return defer.promise;
        			   });
        		   }
        	   }
        	   if($scope.isregulatoryDocForm){
        		   if(!$scope.updateRegulatoryForm){
        			   $q.all($scope.addRegulatoryDocumentsData()).then(function(state) {
        				   return defer.promise;
        			   });
        		   }
        		   else{
        			   $q.all($scope.updateRegulatory()).then(function(state) {
        				   return defer.promise;
        			   });
        		   }
        	   }
        	   if($scope.isAdHocDocmentForm){
        		   if(!$scope.updateAdHocForm){
        			   $q.all($scope.addAddHOCDocumentsData($scope.adHocDocmentForm)).then(function(state) {
        				   return defer.promise;
        			   });
        		   }
        		   else{
        			   $q.all($scope.updateAdHOCDocumentsData($scope.adHocDocmentForm)).then(function(state) {
        				   return defer.promise;
        			   });
        		   }
        	   }
       }
       $scope.checkForValidation=function(){
    	   
    	   console.log('inside check for validation')
    	   if( $scope.isResearchDocument){
    	   $scope.completenessCheck();
    	   }
    	   if($scope.isFundingRelatedDocsForm){
    		   $scope.completenessCheckforFunding();
    	   }
    	   if($scope.isLegalRelatedDocsForm){
    		   
    		   $scope.completenessCheckForLegal();
    	   }
       }
       $scope.exitDocumentation=function(){
    	   if( $scope.isResearchDocument){
    		   	$scope.exitResearchDocuments();
        	   }
        	   if($scope.isFundingRelatedDocsForm){
        		   $scope.exitFundingDocuments();
        	   }
        	   if($scope.isLegalRelatedDocsForm){
        		   
        		   $scope.exitLegalDocuments();
        	   }
    	   
       }
       $scope.setResearchRelatedForm=function(){
    	   $scope.isResearchDocument=true;
    	   $scope.isFundingRelatedDocsForm=false;
    	   $scope.isLegalRelatedDocsForm=false;
    	   $scope.isregulatoryDocForm=false;
    	   $scope.isinstApprovalDocForm=false;
    	   highlightTableRowService.removeHighlight();
			$scope.doctype='';
			$scope.doc_description='';
			 angular.element("input[type='file']").val(null);
			    $scope.file_name="";
			    $scope.doc_description="";
			$scope.language='';
			$scope.pages='';
			$scope.addshow=true;
			$scope.updateshow=false;
			$scope.disableIfDocIsStamped=false;
       }
       $scope.setResearchRelatedForm();
       $scope.setFundingRelatedForm=function(){
    	   $scope.isResearchDocument=false;
    	   $scope.isFundingRelatedDocsForm=true;
    	   $scope.isLegalRelatedDocsForm=false;
    	   $scope.isinstApprovalDocForm=false;
    	   $scope.isregulatoryDocForm=false;
    	   highlightTableRowService.removeHighlight();
	   	    $scope.funding_doctype='';
	   	    angular.element("input[type='file']").val(null);
	   	    $scope.funding_file="";
	   	    $scope.funding_doc_description="";
	   		$scope.funding_language='';
	   		$scope.funding_doc_description='';
	   		$scope.funding_pages='';
	   		$scope.fundingUpdateshow=false;
	   		$scope.fundingAddshow=true;	
	   		if ($scope.functionId == "RSP" || $scope.amdSerialNo>0) {
		     	$rootScope.getPageFieldChangeInBubbleForClaification('researchFundingDocsBubble');
		     }
	   		$scope.disableIfDocIsStamped=false;
       }
       $scope.setLegalRelatedForm=function(){
    	   $scope.isResearchDocument=false;
    	   $scope.isFundingRelatedDocsForm=false;
    	   $scope.isLegalRelatedDocsForm=true;
    	   $scope.isinstApprovalDocForm=false;
    	   $scope.isregulatoryDocForm=false;
    		highlightTableRowService.removeHighlight();
    	    $scope.legal_doctype='';
    	   // document.getElementById("legal_file").value = "";
    	    angular.element("input[type='file']").val(null);
    	    $scope.legal_file="";
			$scope.legal_doc_description='';
    		$scope.legal_language='';
    		$scope.legal_pages='';
    		$scope.legalRelatedDocs.$setPristine(true);
    		$scope.legalAddshow=true;
    		$scope.legalUpdateshow=false;
    		$scope.legal_doc_description="";
    		$scope.disableIfDocIsStamped=false;
    		if ($scope.functionId == "RSP" || $scope.amdSerialNo>0) {
		     	$rootScope.getPageFieldChangeInBubbleForClaification('researchLegalDocsBubble');
		     }
       }
       $scope.setInstitutionalForm=function(){
    	   $scope.isResearchDocument=false;
    	   $scope.isFundingRelatedDocsForm=false;
    	   $scope.isLegalRelatedDocsForm=false;
    	   $scope.isinstApprovalDocForm=true;
    	   $scope.isregulatoryDocForm=false;
    		highlightTableRowService.removeHighlight();
    		 angular.element("input[type='file']").val(null);
    		 $scope.disableIfDocIsStamped=false;
    		 if ($scope.functionId == "RSP" || $scope.amdSerialNo>0) {
 		     	$rootScope.getPageFieldChangeInBubbleForClaification('researchinstitutionalDocsBubble');
 		     }
       }
       $scope.setIsRegulatoryDocForm=function(){
    	   $scope.isResearchDocument=false;
    	   $scope.isFundingRelatedDocsForm=false;
    	   $scope.isLegalRelatedDocsForm=false;
    	   $scope.isinstApprovalDocForm=false;
    	   $scope.isregulatoryDocForm=true;
    		highlightTableRowService.removeHighlight();
    		 angular.element("input[type='file']").val(null);
    		 $scope.disableIfDocIsStamped=false;
    		 if ($scope.functionId == "RSP" || $scope.amdSerialNo>0) {
  		     	$rootScope.getPageFieldChangeInBubbleForClaification('researchRegulatoryDocsBubble');
  		     }
       }
       //isinstApprovalDocForm
       $scope.NavigateToNextTab=function()
       {
      	 if($scope.nextOrPrevValue!=0)
      		 {
	      		if($rootScope.isRiskProfiletabShow==true)
	      			$rootScope.tabNavigationMainMethod($scope.nextOrPrevValue);
	      		else if($rootScope.isFundingtabShow==true)
	      			$rootScope.tabNavigationMainMethod(4);
	      		else
	      			$rootScope.tabNavigationMainMethod(3);
	      	 }
       }
       
   // Legal related code ends here
//institutional related code
       $scope.getInstitutionalCategory=function(){
           var dataObjForCourse = {
                         codeSet             :      "DOC_CATG_081"
             };
           var res = $http.post('getCodeSetByParentCodeSetextra', dataObjForCourse);
           res.success(function(data, status, headers, config) {
                  $scope.institutionalTypeCategory=[];
                  $scope.institutionalTypeCategory=data;
                         
           });
           res.error(function(data, status, headers, config) {
           });    
       }
       $scope.getInstitutionalCategory();
       //Adding new record code starts here 
       $scope.addInstitutionalDocumentsData=function(){
       		var defer = $q.defer();
     			$scope.isSave=completionCheckService.saveForLaterCheck(messages.validateSaveForLaterForInstitutional,messages.validateSaveForLaterForInstitutional);
     			//$rootScope.researchLegalPercentage=$rootScope.saveForLatercount;
     			if($scope.isSave ==false){
     				   notif({
     						  type: "error",
     						  msg: messages.plzFillRedData,
     						  position: "center",
     						  multiline:true,
     						  timeout: 6000
     						});
     				 defer.reject('false');
     				sessionStorage.setItem("isCorrect", 'false');
     				   return false;
     			   }
     			 var file = $scope.institutional_doc_file;
     			if(file!=undefined && file!="" && file!="No file"){
     				var type=file;
     				var array=[];
     				var result="";
     				var typesAllowedInUpload=messages.typeOfDocsToUpload;
     				
     				array=typesAllowedInUpload.split(",");
     				
     				for (var i = 0; i < file.length; i++) {
     					for(var j=0;j<array.length;j++){
     						if(file[i].type == array[j]){
     	  						result="success";
     	  						break ;
     	  					}else{
     	  					result="";
     	  					}
     					}
     					
     				}
     				if(result!="success" && type!=""){
     					 notif({
     							type : "warning",
     							msg : messages.uploadFilesWarning,
     							position : "center",
     							multiline: true,
     							timeout : 6000,
     							autohide: true
     						});
     					defer.reject('false');
     					sessionStorage.setItem("isCorrect", 'false');
     					 return false;
     				}
     				if($scope.institutional_pages=="" || $scope.institutional_pages==undefined || $scope.institutional_pages==null){
						notif({
							type : "warning",
							msg : "Please enter document pages",
							position : "center",
							multiline: true,
							timeout : 6000,
							autohide: true
						});
						return false;
					} if($scope.institutional_pages==0 || $scope.institutional_pages<0){
						notif({
							type : "warning",
							msg : "Document pages should be greater than 0",
							position : "center",
							multiline: true,
							timeout : 6000,
							autohide: true
						});
						return false;
					}
     				$scope.isSpecialChar= documentValidation.checkForSpecialCharMulti(file);
     				$scope.isSpecialChar= documentValidation.checkForDocumentNameLenghtMulti(file);
     				
     				var size=file.size+"";
     				var testsize=messages.maxsize; 
     				if(Number(testsize)<Number(size)){
     							testsize = testsize/1024;
     							testsize=testsize/1024;
     							notif({
     								type : "warning",
     								msg : messages.configSize+testsize+".MB",
     								position : "center",
     								multiline: true,
     								timeout : 6000,
     								autohide: true
     							});
     							defer.reject('false');
     							sessionStorage.setItem("isCorrect", 'false');
     						 return false; 			
     						}
     			 }else{
     			 }
     	    	if (1==1) {
     	    	var documentsData={
     	    			document_type:			$scope.institutional_doctype,
     	    			document_description:	$scope.institutional_doc_description,
     	    			language:				$scope.institutional_language,
     	    			pages:					""+$scope.institutional_pages,
     	    			document_category:		"DOC_CATG_081",
     	    			research_id:			""+$rootScope.researchApplicationId,
     	    			no_of_documents:parseInt(($scope.institutional_doc_file==undefined?1:$scope.institutional_doc_file.length)),
     	    	}
     	    	$scope.functionId = sessionStorage.getItem("functionId");
	            $scope.reqtHrdIdTemp= parseInt(sessionStorage.getItem("rfcHrdId"));
	            if(isNaN($scope.reqtHrdIdTemp)){
	            	$scope.reqtHrdIdTemp=1;
	            }
	            documentsData['functionId'] = $scope.functionId;
	            documentsData['reqtHrdId'] = $scope.reqtHrdIdTemp;
     			    		 var res = $http.post('save-documents-data', documentsData);
     			        	 res.success(function(data, status, headers, config) {
     			        		 if(data>0){
     			        			defer.resolve('true');
     			        			sessionStorage.setItem("isCorrect", 'true');
     			        			$scope.keyPressedForAutoSave = false;
     			        			sessionStorage.setItem("dataChange", $scope.keyPressedForAutoSave);
     			        			 var myCallback = function(){
     			        				 if($scope.institutional_doc_file != "" && $scope.institutional_doc_file != undefined && $scope.institutional_doc_file!="No file"){
     			        					 $scope.institutionalUploadFile("institutional_doc").then(function(){
     			        						if($scope.institutionalResult){
    												notif({
    													type : "success",
    													msg : messages.resDocUpdateSuccess,
    													position : "center",
    													multiline: true,
    													timeout : 6000,
    													autohide: true,
    													
    												});
    												$scope.checkForErrorInApplication();
    												$scope.NavigateToNextTab();
    												$scope.resetInstitutionalData();
    											}else if (typeof $scope.institutionalResult === 'string' || $scope.institutionalResult instanceof String){
    									  			  if(data.search("The requested URL was rejected") > -1){
    									 				  var supportId = data.match(/\d/g);
    									 				  var errorObject = {
    									  						title :"Error",
    									  						content : '<p class="alert  text-center">Firewall getting blocked. <br />Please contact MRC with screen shot & Send a mail to <b>AbhathSupport@hamad.qa</b> with below support ID<br /><b>Your support ID is :'+supportId.join("")+'</b>.</p>'
    									  				  };
    									  				  ResearchApplicationModalService.openCustomAlertMessage(errorObject);
    									  		 		
    									 			  }
    									 		  }else{
    												notif({
    													type : "error",
    													msg : "Document Not uploaded. Contact Admin",
    													position : "center",
    													multiline: true,
    													timeout : 6000,
    													autohide: true,
    													
    												});
    											}
     			        						
     			        						
     			        					 });
     			        				 	}else{
     			        				 		$scope.genericMethod();
     			        				 	}
     			          			     }
     			        			$scope.NavigateToNextTab();
     			        			 myCallback();
     			        				$scope.genericMethod();
     			        				$scope.getBannerDataFromService();
     			        		 }else if (typeof data === 'string' || data instanceof String){
     					  			  if(data.search("The requested URL was rejected") > -1){
     					 				  var supportId = data.match(/\d/g);
     					 				  var errorObject = {
     					  						title :"Error",
     					  						content : '<p class="alert  text-center">Firewall getting blocked. <br />Please contact MRC with screen shot & Send a mail to <b>AbhathSupport@hamad.qa</b> with below support ID<br /><b>Your support ID is :'+supportId.join("")+'</b>.</p>'
     					  				  };
     					  				  ResearchApplicationModalService.openCustomAlertMessage(errorObject);
     					  		 		
     					 			  }
     					 		  }else{
     			        			 notif({
     			        					type : "error",
     			        					msg : messages.resDocSaveError,
     			        					position : "center",
     			        					multiline : true,
     			        					timeout : 6000
     			        				});
     			        		 }
     			        		
     			        			
     			        	 });
     			        	 res.error(function(data, status, headers, config) {
     			        	});
     	    	}else{
     	    		defer.reject('false');
     	    		sessionStorage.setItem("isCorrect", 'false');
     	    	}
     		return defer.promise;
       }//adding new record code ends here
       $scope.updateInstitutional=function(){
    	   var defer = $q.defer();
    	   if($scope.institutional_pages=="" || $scope.institutional_pages==undefined || $scope.institutional_pages==null){
				notif({
					type : "warning",
					msg : "Please enter document pages",
					position : "center",
					multiline: true,
					timeout : 6000,
					autohide: true
				});
				return false;
			} if($scope.institutional_pages==0 || $scope.institutional_pages<0){
				notif({
					type : "warning",
					msg : "Document pages should be greater than 0",
					position : "center",
					multiline: true,
					timeout : 6000,
					autohide: true
				});
				return false;
			}
    	   if(isCaseReport=='true'){
    			 $scope.isSave=completionCheckService.saveForLaterCheck(messages.validateSaveForLater,messages.validateCompleteness);
    		 }else{
    			 $scope.isSave=completionCheckService.saveForLaterCheck(messages.validateSaveForLaterForInstitutional,messages.validateSaveForLaterForInstitutional);
    		 }
    			  var dataObj={
    					   document_type:			$scope.institutional_doctype,
    						document_description:	$scope.institutional_doc_description,
    						language:				$scope.institutional_language,
    						pages:					""+$scope.institutional_pages,
    						document_category:		"DOC_CATG_081",
    						research_id:			""+$rootScope.researchApplicationId,
    						research_doc_id:		""+$scope.row_id,
    						no_of_documents:parseInt(($scope.institutional_doc_file==undefined?1:$scope.institutional_doc_file.length)),
    			   }
    			   var file = $scope.institutional_doc_file;
    			   if(file!=undefined && file!="" && file!="No file" && file.length!=0){
    					//var file = $scope.doc_file;
    					var type=file[0].type;
    					var array=[];
    					var result="";
    					var typesAllowedInUpload=messages.typeOfDocsToUpload;
    					
    					array=typesAllowedInUpload.split(",");
    					
    					for (var i = 0; i < array.length; i++) {
    						if(type == array[i]){
    							result="success";
    							break;
    						}
    					}
    					if(result!="success"&& type!=""){
    						 notif({
    								type : "warning",
    								msg : messages.uploadFilesWarning,
    								position : "center",
    								multiline: true,
    								timeout : 6000,
    								autohide: true
    							});
    						 return false;
    					}
    					$scope.isSpecialChar= documentValidation.checkForSpecialCharMulti(file);
    					$scope.isSpecialChar= documentValidation.checkForDocumentNameLenghtMulti(file);
    					
    					var size=file.size+"";
    					var testsize=messages.maxsize; 
    					if(Number(testsize)<Number(size)){
    								testsize = testsize/1024;
    								testsize=testsize/1024;
    								notif({
    									type : "warning",
    									msg : messages.configSize+testsize+".MB",
    									position : "center",
    									multiline: true,
    									timeout : 6000,
    									autohide: true
    								});
    							 return false; 			
    							}
    					
    				 }else{
    				 }
    			   
    			   var document_type_exits = $scope.doctype;
    				var document_message=mesaages.editrow;

    				angular.forEach($scope.researchDocumentsData, function(value, key){
    				      if(value.doc_type == document_type_exits && value.row_id!=$scope.row_id){
    				    	  document_message = document_type_exits + messages.researchupload;
    				    	  document_type_exits = "";
    				    	  
    				      }
    				   });
    				$scope.functionId = sessionStorage.getItem("functionId");
		            $scope.reqtHrdIdTemp= parseInt(sessionStorage.getItem("rfcHrdId"));
		            if(isNaN($scope.reqtHrdIdTemp)){
		            	$scope.reqtHrdIdTemp=1;
		            }
		            dataObj['functionId'] = $scope.functionId;
		            dataObj['reqtHrdId'] = $scope.reqtHrdIdTemp;
    			   var res = $http.post('save-documents-data', dataObj);
    				 res.success(function(data, status, headers, config) {
    					 if(data>0){
    						 defer.resolve('true');
    						 sessionStorage.setItem("isCorrect", 'true');
    						 $scope.keyPressedForAutoSave = false;
    						 sessionStorage.setItem("dataChange", $scope.keyPressedForAutoSave);
    						 var myCallback = function(){
    							 if($scope.institutional_doc_file!=undefined && $scope.institutional_doc_file!= "" && $scope.institutional_doc_file!="No file" && $scope.institutional_doc_file.length!=0){
    								$scope.institutionalUploadFile("institutional_doc").then(function(){
    									if($scope.institutionalResult){
											notif({
												type : "success",
												msg : messages.resDocUpdateSuccess,
												position : "center",
												multiline: true,
												timeout : 6000,
												autohide: true,
												
											});
											$scope.checkForErrorInApplication();
											$scope.NavigateToNextTab();
											$scope.resetInstitutionalData();
										}else if (typeof $scope.institutionalResult === 'string' || $scope.institutionalResult instanceof String){
		     					  			  if(data.search("The requested URL was rejected") > -1){
		     					 				  var supportId = data.match(/\d/g);
		     					 				  var errorObject = {
		     					  						title :"Error",
		     					  						content : '<p class="alert  text-center">Firewall getting blocked. <br />Please contact MRC with screen shot & Send a mail to <b>AbhathSupport@hamad.qa</b> with below support ID<br /><b>Your support ID is :'+supportId.join("")+'</b>.</p>'
		     					  				  };
		     					  				  ResearchApplicationModalService.openCustomAlertMessage(errorObject);
		     					  		 		
		     					 			  }
		     					 		  }else{
											notif({
												type : "error",
												msg : "Document Not uploaded. Please Contact Admin",
												position : "center",
												multiline: true,
												timeout : 6000,
												autohide: true,
												
											});
										}
    								});
    								
    							 	}else{
    							 		$scope.genericMethod();
    							 	}
    			  			     }
    						 $scope.NavigateToNextTab();
    						 myCallback();
    							$scope.genericMethod();
    							$scope.getBannerDataFromService();
    					 }else if (typeof data === 'string' || data instanceof String){
				  			  if(data.search("The requested URL was rejected") > -1){
					 				  var supportId = data.match(/\d/g);
					 				  var errorObject = {
					  						title :"Error",
					  						content : '<p class="alert  text-center">Firewall getting blocked. <br />Please contact MRC with screen shot & Send a mail to <b>AbhathSupport@hamad.qa</b> with below support ID<br /><b>Your support ID is :'+supportId.join("")+'</b>.</p>'
					  				  };
					  				  ResearchApplicationModalService.openCustomAlertMessage(errorObject);
					  		 		
					 			  }
					 		  }else{
    						 notif({
    								type : "error",
    								msg : messages.resDocUpdateError,
    								position : "center",
    								multiline : true,
    								timeout : 6000
    							});
    					 }
    					
    						
    				 });
    				 res.error(function(data, status, headers, config) {
    					 defer.reject();
    					 
    				});	
    				 return defer.promise;
       }
       $scope.resetInstitutionalData=function(){
    	   $scope.institutional_doctype='';
    	   $scope.institutional_language='';
    	   $scope.institutional_pages='';
    	   $scope.institutional_doc_description='';
    	   $scope.institutionalDisable=false;
    	   angular.element("input[type='file']").val(null);
       }
       //window actions
       
       $scope.editInstitutionalDocument= function (row,index) {

	         	$.confirm({
	     		    title: mesaages.areusure,
	     		    content_box: mesaages.editrow,
	     		    confirm: function(){
	     		    	$scope.institutionalDisable=true;
	     		    $scope.updateInstitutionalForm=true
	     		    	 $scope.selected = row;
	     				 $scope.indexvalue=index;
	     				$scope.institutional_doctype=$scope.selected.doc_type_codeSet;
	     				$scope.institutional_doc_description=$scope.selected.doc_desc;
	     				$scope.institutional_language=$scope.selected.language;
	     				$scope.institutional_pages=$scope.selected.pages;
	     				$scope.institutional_doc_file_nohref= $scope.selected.file_noHref;
	     				$scope.row_id= $scope.selected.row_id;
	     				$scope.$apply();
	     				if ($scope.amdSerialNo > 0 && sessionStorage.getItem("workItemSubCode")=="AMEND_MODE") {
	    		    		$scope.subTableId=[];
	    	            	$scope.subTableId.push("expenseDocumentTable");
	    	            	$rootScope.highelightFieldForAmendment($scope.selected.row_id,$scope.subTableId,messages.validateSaveForLaterForInstitutional);
	                    }
	     			$("#institutional_related_tab").css({ display: "block" });
	     			$( ".back-to-top" ).trigger( "click" );
	     		    }
	         	});
	         
       }
       
       $scope.removeInstitutionalDocument= function (row,index) {

	        	$scope.isAlloedToDelete=true;
       	 $.each($scope.dataInsertedByWorkFlow,function(key,value){
       		 if(row.row_id==value.docId){
       			 notif({
						  type: "warning",
						  msg: messages.deleteRestrict,
						  position: "center",
						  multiline : true,
						  timeout: 6000
						});
       			 $scope.isAlloedToDelete=false;
       			 return false;
       		 }
       	 });
       	 if($scope.isAlloedToDelete==true){
		  			$.confirm({
	    		    title: mesaages.areusure,
	    		    content_box: mesaages.deleterow,
	    		    confirm: function(){
	    		    	$scope.showorhideupdate=true;
	    		    	$scope.showorhideadd=false;
	    		    	 $scope.selected = row;
		           	var dataObj={
		           			research_doc_id:		""+$scope.selected.row_id,
					};
			   		
			   		var res = $http.post('remove-res-docs', dataObj);
					 res.success(function(data, status, headers, config) {
			 			$scope.message = data ;
			 			if($scope.message == true){
			 				 	
			 				 	 notif({
			 						  type: "success",
			 						  msg: messages.deletedsuccessfully,
			 						  position: "center",
			 						  multiline : true,
			 						  timeout: 6000
			 						});
			 				 $scope.resetInstitutionalData();
		    				$scope.genericMethod();
			 			}else{
			 				 notif({
			 					  type: "error",
			 					  msg: messages.contactadmin,
			 					  position: "center",
			 					  multiline:true,
			 					  timeout: 6000
			 					});
			 			}
			 		});
					res.error(function(data, status, headers, config) {
						notif({
							  type: "error",
							  msg: mesaages.error,
							  position: "center",
							  multiline : true,
							  timeout: 6000
							});
					});	
	    		    }
	        	});
       	 }
	        
       }
//inst related code ends here
//regulatory ckde starts here
       $scope.getRegulatoryCategory=function(){
           var dataObjForCourse = {
                         codeSet             :      "DOC_CATG_101"
             };
           var res = $http.post('getCodeSetByParentCodeSetextra', dataObjForCourse);
           res.success(function(data, status, headers, config) {
                  $scope.regulatoryTypeCategory=[];
                  $scope.regulatoryTypeCategory=data;
                         
           });
           res.error(function(data, status, headers, config) {
           });    
       }
       $scope.getRegulatoryCategory();
       $scope.getAdHocCategory=function(){
           var dataObjForCourse = {
                         codeSet             :      "DOC_CATG_021"
             };
           var res = $http.post('getCodeSetByParentCodeSetextra', dataObjForCourse);
           res.success(function(data, status, headers, config) {
                  $scope.adHocTypeCategory=[];
                  $scope.adHocTypeCategory=data;
                         
           });
           res.error(function(data, status, headers, config) {
           });    
       }
       $scope.getAdHocCategory();
       //Adding new record code starts here 
       $scope.addRegulatoryDocumentsData=function(){
       		var defer = $q.defer();
     			$scope.isSave=completionCheckService.saveForLaterCheck(messages.validateSaveForLaterForRegulatory,messages.validateSaveForLaterForRegulatory);
     			if($scope.isSave ==false){
     				   notif({
     						  type: "error",
     						  msg: messages.plzFillRedData,
     						  position: "center",
     						  multiline:true,
     						  timeout: 6000
     						});
     				 defer.reject('false');
     				sessionStorage.setItem("isCorrect", 'false');
     				   return false;
     			   }
     			 var file = $scope.regulatory_doc_file;
     			if(file!=undefined && file!="" && file!="No file"){
     				var type=file;
     				var array=[];
     				var result="";
     				var typesAllowedInUpload=messages.typeOfDocsToUpload;
     				
     				array=typesAllowedInUpload.split(",");
     				
     				for (var i = 0; i < file.length; i++) {
     					for(var j=0;j<array.length;j++){
     						if(file[i].type == array[j]){
     	  						result="success";
     	  						break ;
     	  					}else{
     	  					result="";
     	  					}
     					}
     					
     				}
     				if(result!="success" && type!=""){
     					 notif({
     							type : "warning",
     							msg : messages.uploadFilesWarning,
     							position : "center",
     							multiline: true,
     							timeout : 6000,
     							autohide: true
     						});
     					defer.reject('false');
     					sessionStorage.setItem("isCorrect", 'false');
     					 return false;
     				}
     				if($scope.regulatory_pages=="" || $scope.regulatory_pages==undefined || $scope.regulatory_pages==null){
						notif({
							type : "warning",
							msg : "Please enter document pages",
							position : "center",
							multiline: true,
							timeout : 6000,
							autohide: true
						});
						return false;
					} if($scope.regulatory_pages==0 || $scope.regulatory_pages<0){
						notif({
							type : "warning",
							msg : "Document pages should be greater than 0",
							position : "center",
							multiline: true,
							timeout : 6000,
							autohide: true
						});
						return false;
					}
     				$scope.isSpecialChar= documentValidation.checkForSpecialCharMulti(file);
     				$scope.isSpecialChar= documentValidation.checkForDocumentNameLenghtMulti(file);

     				var size=file.size+"";
     				var testsize=messages.maxsize; 
     				if(Number(testsize)<Number(size)){
     							testsize = testsize/1024;
     							testsize=testsize/1024;
     							notif({
     								type : "warning",
     								msg : messages.configSize+testsize+".MB",
     								position : "center",
     								multiline: true,
     								timeout : 6000,
     								autohide: true
     							});
     							defer.reject('false');
     							sessionStorage.setItem("isCorrect", 'false');
     						 return false; 			
     						}
     			 }else{
     			 }
     	    	if (1==1) {
     	    	var documentsData={
     	    			document_type:			$scope.regulatory_doctype,
     	    			document_description:	$scope.regulatory_doc_description,
     	    			language:				$scope.regulatory_language,
     	    			pages:					""+$scope.regulatory_pages,
     	    			document_category:		"DOC_CATG_101",
     	    			research_id:			""+$rootScope.researchApplicationId,
     	    			no_of_documents:parseInt(($scope.regulatory_doc_file==undefined?1:$scope.regulatory_doc_file.length)),
     	    	}
     	    	$scope.functionId = sessionStorage.getItem("functionId");
	            $scope.reqtHrdIdTemp= parseInt(sessionStorage.getItem("rfcHrdId"));
	            if(isNaN($scope.reqtHrdIdTemp)){
	            	$scope.reqtHrdIdTemp=1;
	            }
	            documentsData['functionId'] = $scope.functionId;
	            documentsData['reqtHrdId'] = $scope.reqtHrdIdTemp;
     			    		 var res = $http.post('save-documents-data', documentsData);
     			        	 res.success(function(data, status, headers, config) {
     			        		 if(data>0){
     			        			defer.resolve('true');
     			        			sessionStorage.setItem("isCorrect", 'true');
     			        			$scope.keyPressedForAutoSave = false;
     			        			sessionStorage.setItem("dataChange", $scope.keyPressedForAutoSave);
     			        			 var myCallback = function(){
     			        				 if($scope.regulatory_doc_file != "" && $scope.regulatory_doc_file != undefined && $scope.regulatory_doc_file!="No file"){
     			        					 $scope.regulatoryUploadFile("regulatory_doc").then(function(){
     			        						if($scope.regulatoryResult){
     												notif({
     													type : "success",
     													msg : messages.resDocUpdateSuccess,
     													position : "center",
     													multiline: true,
     													timeout : 6000,
     													autohide: true,
     													
     												});
     												$scope.checkForErrorInApplication();
     												$scope.NavigateToNextTab();
     												$scope.resetRegulatoryData();
     											}else if (typeof $scope.regulatoryResult === 'string' || $scope.regulatoryResult instanceof String){
     									  			  if(data.search("The requested URL was rejected") > -1){
     									 				  var supportId = data.match(/\d/g);
     									 				  var errorObject = {
     									  						title :"Error",
     									  						content : '<p class="alert  text-center">Firewall getting blocked. <br />Please contact MRC with screen shot & Send a mail to <b>AbhathSupport@hamad.qa</b> with below support ID<br /><b>Your support ID is :'+supportId.join("")+'</b>.</p>'
     									  				  };
     									  				  ResearchApplicationModalService.openCustomAlertMessage(errorObject);
     									  		 		
     									 			  }
     									 		  }else{
     												notif({
     													type : "error",
     													msg : "Document Not uploaded. Please Contact Admin",
     													position : "center",
     													multiline: true,
     													timeout : 6000,
     													autohide: true,
     													
     												});
     											}
     			        						
     			        					 });
     			        				 	}else{
     			        				 		$scope.genericMethod();
     			        				 	}
     			          			     }
     			        			$scope.NavigateToNextTab();
     			        			 myCallback();
     			        				$scope.genericMethod();
     			        				$scope.getBannerDataFromService();
     			        		 }else if (typeof data === 'string' || data instanceof String){
     					  			  if(data.search("The requested URL was rejected") > -1){
    					 				  var supportId = data.match(/\d/g);
    					 				  var errorObject = {
    					  						title :"Error",
    					  						content : '<p class="alert  text-center">Firewall getting blocked. <br />Please contact MRC with screen shot & Send a mail to <b>AbhathSupport@hamad.qa</b> with below support ID<br /><b>Your support ID is :'+supportId.join("")+'</b>.</p>'
    					  				  };
    					  				  ResearchApplicationModalService.openCustomAlertMessage(errorObject);
    					  		 		
    					 			  }
    					 		  }else{
     			        			 notif({
     			        					type : "error",
     			        					msg : messages.resDocSaveError,
     			        					position : "center",
     			        					multiline : true,
     			        					timeout : 6000
     			        				});
     			        		 }
     			        		
     			        			
     			        	 });
     			        	 res.error(function(data, status, headers, config) {
     			        	});
     	    	}else{
     	    		defer.reject('false');
     	    		sessionStorage.setItem("isCorrect", 'false');
     	    	}
     		return defer.promise;
       }//adding new record code ends here
       $scope.updateRegulatory=function(){
    	   var defer = $q.defer();
    	   if(isCaseReport=='true'){
    			 $scope.isSave=completionCheckService.saveForLaterCheck(messages.validateSaveForLater,messages.validateCompleteness);
    		 }else{
    			 $scope.isSave=completionCheckService.saveForLaterCheck(messages.validateSaveForLaterForRegulatory,messages.validateSaveForLaterForRegulatory);
    		 }
    	   if($scope.regulatory_pages=="" || $scope.regulatory_pages==undefined || $scope.regulatory_pages==null){
				notif({
					type : "warning",
					msg : "Please enter document pages",
					position : "center",
					multiline: true,
					timeout : 6000,
					autohide: true
				});
				return false;
			} if($scope.regulatory_pages==0 || $scope.regulatory_pages<0){
				notif({
					type : "warning",
					msg : "Document pages should be greater than 0",
					position : "center",
					multiline: true,
					timeout : 6000,
					autohide: true
				});
				return false;
			}
    			  var dataObj={
    					   document_type:			$scope.regulatory_doctype,
    						document_description:	$scope.regulatory_doc_description,
    						language:				$scope.regulatory_language,
    						pages:					""+$scope.regulatory_pages,
    						document_category:		"DOC_CATG_101",
    						research_id:			""+$rootScope.researchApplicationId,
    						research_doc_id:		""+$scope.row_id,
    						no_of_documents:parseInt(($scope.regulatory_doc_file==undefined?1:$scope.regulatory_doc_file.length)),
    			   }
    			   var file = $scope.regulatory_doc_file;
    			   if(file!=undefined && file!="" && file!="No file" && file.length!=0){
    					//var file = $scope.doc_file;
    					var type=file[0].type;
    					var array=[];
    					var result="";
    					var typesAllowedInUpload=messages.typeOfDocsToUpload;
    					
    					array=typesAllowedInUpload.split(",");
    					
    					for (var i = 0; i < array.length; i++) {
    						if(type == array[i]){
    							result="success";
    							break;
    						}
    					}
    					//result="success";
    					if(result!="success"&& type!=""){
    						 notif({
    								type : "warning",
    								msg : messages.uploadFilesWarning,
    								position : "center",
    								multiline: true,
    								timeout : 6000,
    								autohide: true
    							});
    						 return false;
    					}
    					$scope.isSpecialChar= documentValidation.checkForSpecialCharMulti(file);
    					$scope.isSpecialChar= documentValidation.checkForDocumentNameLenghtMulti(file);
    					
    					var size=file.size+"";
    					var testsize=messages.maxsize; 
    					if(Number(testsize)<Number(size)){
    								testsize = testsize/1024;
    								testsize=testsize/1024;
    								notif({
    									type : "warning",
    									msg : messages.configSize+testsize+".MB",
    									position : "center",
    									multiline: true,
    									timeout : 6000,
    									autohide: true
    								});
    							 return false; 			
    							}
    					
    				 }else{
    				 }
    			   
    			   var document_type_exits = $scope.doctype;
    				var document_message=mesaages.editrow;

    				angular.forEach($scope.researchDocumentsData, function(value, key){
    				      if(value.doc_type == document_type_exits && value.row_id!=$scope.row_id){
    				    	  document_message = document_type_exits + messages.researchupload;
    				    	  document_type_exits = "";
    				    	  
    				      }
    				   });
    				$scope.functionId = sessionStorage.getItem("functionId");
		            $scope.reqtHrdIdTemp= parseInt(sessionStorage.getItem("rfcHrdId"));
		            if(isNaN($scope.reqtHrdIdTemp)){
		            	$scope.reqtHrdIdTemp=1;
		            }
		            dataObj['functionId'] = $scope.functionId;
		            dataObj['reqtHrdId'] = $scope.reqtHrdIdTemp;
    			   var res = $http.post('save-documents-data', dataObj);
    				 res.success(function(data, status, headers, config) {
    					 if(data>0){
    						 defer.resolve('true');
    						 sessionStorage.setItem("isCorrect", 'true');
    						 $scope.keyPressedForAutoSave = false;
    						 sessionStorage.setItem("dataChange", $scope.keyPressedForAutoSave);
    						 var myCallback = function(){
    							 if($scope.regulatory_doc_file!=undefined && $scope.regulatory_doc_file!= "" && $scope.regulatory_doc_file!="No file" && $scope.regulatory_doc_file.length!=0){
    								$scope.regulatoryUploadFile("Regulatory_Doc").then(function(){
    									if($scope.regulatoryResult){
												notif({
													type : "success",
													msg : messages.resDocUpdateSuccess,
													position : "center",
													multiline: true,
													timeout : 6000,
													autohide: true,
													
												});
												$scope.checkForErrorInApplication();
												$scope.NavigateToNextTab();
												$scope.resetRegulatoryData();
											}else if (typeof $scope.regulatoryResult === 'string' || $scope.regulatoryResult instanceof String){
									  			  if(data.search("The requested URL was rejected") > -1){
 									 				  var supportId = data.match(/\d/g);
 									 				  var errorObject = {
 									  						title :"Error",
 									  						content : '<p class="alert  text-center">Firewall getting blocked. <br />Please contact MRC with screen shot & Send a mail to <b>AbhathSupport@hamad.qa</b> with below support ID<br /><b>Your support ID is :'+supportId.join("")+'</b>.</p>'
 									  				  };
 									  				  ResearchApplicationModalService.openCustomAlertMessage(errorObject);
 									  		 		
 									 			  }
 									 		  }else{
												notif({
													type : "error",
													msg : "Document Not uploaded. Please Contact Admin",
													position : "center",
													multiline: true,
													timeout : 6000,
													autohide: true,
													
												});
											}
    								});
    								
    							 	}else{
    							 		$scope.genericMethod();
    							 	}
    			  			     }
    						 $scope.NavigateToNextTab();
    						 myCallback();
    							$scope.genericMethod();
    							$scope.getBannerDataFromService();
    							$scope.row_id=0;
    					 }else if (typeof data === 'string' || data instanceof String){
				  			  if(data.search("The requested URL was rejected") > -1){
					 				  var supportId = data.match(/\d/g);
					 				  var errorObject = {
					  						title :"Error",
					  						content : '<p class="alert  text-center">Firewall getting blocked. <br />Please contact MRC with screen shot & Send a mail to <b>AbhathSupport@hamad.qa</b> with below support ID<br /><b>Your support ID is :'+supportId.join("")+'</b>.</p>'
					  				  };
					  				  ResearchApplicationModalService.openCustomAlertMessage(errorObject);
					  		 		
					 			  }
					 		  }else{
    						 notif({
    								type : "error",
    								msg : messages.resDocUpdateError,
    								position : "center",
    								multiline : true,
    								timeout : 6000
    							});
    					 }
    					
    						
    				 });
    				 res.error(function(data, status, headers, config) {
    					 defer.reject();
    					 
    				});	
    				 return defer.promise;
       }
       $scope.resetRegulatoryData=function(){
    	   $scope.regulatory_doctype='';
    	   $scope.regulatory_language='';
    	   $scope.regulatory_pages='';
    	   $scope.regulatory_doc_description='';
    	   $scope.regulatoryDisable=false;
    	   angular.element("input[type='file']").val(null);
       }
       
       $scope.editRegulatoryDocument=function(row,index){
    		$.confirm({
    		    title: mesaages.areusure,
    		    content_box: mesaages.editrow,
    		    confirm: function(){
    		    	if ($scope.functionId == "RSP") {
    	           		 $scope.setFiledChangedInPage('HACView_Research_documents_regulatory_related_table',row);
    	               }
    		    	$scope.updateRegulatoryForm=true;
    		    	$scope.regulatoryDisable=true;
    		    	 $scope.selected = row;
    		    	 $scope.regulatory_doctype=$scope.selected.doc_type_codeSet;
       				$scope.regulatory_doc_description=$scope.selected.doc_desc;
       				$scope.regulatory_language=$scope.selected.language;
       				$scope.regulatory_pages=$scope.selected.pages;
       				$scope.regulatory_doc_file2= $scope.selected.file_noHref;
       				$scope.row_id= $scope.selected.row_id;
       				if(row.is_stamped==true){
       					if ($scope.amdSerialNo > 0 && sessionStorage.getItem("workItemSubCode")=="AMEND_MODE") {
       						$scope.disableIfDocIsStamped=false;
       					}else{
       						$scope.disableIfDocIsStamped=true;
       					}
    					
    				}else{
    					$scope.disableIfDocIsStamped=false;
    				}
       				if ($scope.amdSerialNo > 0 && sessionStorage.getItem("workItemSubCode")=="AMEND_MODE") {
    		    		$scope.subTableId=[];
    	            	$scope.subTableId.push("expenseDocumentTable");
    	            	$rootScope.highelightFieldForAmendment($scope.selected.row_id,$scope.subTableId,messages.validateSaveForLaterForRegulatory);
                    }
       				$scope.$apply();
    				$("#regulatory_related_tab").css({ display: "block" });
    				$( ".back-to-top" ).trigger( "click" );
    		    }
      	});
}
       
       $scope.removeRegulatoryDocument=function(row,index){

	        	$scope.isAlloedToDelete=true;
       	 $.each($scope.dataInsertedByWorkFlow,function(key,value){
       		 if(row.row_id==value.docId){
       			 notif({
						  type: "warning",
						  msg: messages.deleteRestrict,
						  position: "center",
						  multiline : true,
						  timeout: 6000
						});
       			 $scope.isAlloedToDelete=false;
       			 return false;
       		 }
       	 });
       	 if($scope.isAlloedToDelete==true){
		  			$.confirm({
	    		    title: mesaages.areusure,
	    		    content_box: mesaages.deleterow,
	    		    confirm: function(){
	    		    	$scope.showorhideupdate=true;
	    		    	$scope.showorhideadd=false;
	    		    	 $scope.selected = row;
		           	var dataObj={
		           			research_doc_id:		""+$scope.selected.row_id,
					};
			   		
			   		var res = $http.post('remove-res-docs', dataObj);
					 res.success(function(data, status, headers, config) {
			 			$scope.message = data ;
			 			if($scope.message == true){
			 				 	
			 				 	 notif({
			 						  type: "success",
			 						  msg: messages.deletedsuccessfully,
			 						  position: "center",
			 						  multiline : true,
			 						  timeout: 6000
			 						});
			 				 $scope.resetInstitutionalData();
		    				$scope.genericMethod();
			 			}else{
			 				 notif({
			 					  type: "error",
			 					  msg: messages.contactadmin,
			 					  position: "center",
			 					  multiline:true,
			 					  timeout: 6000
			 					});
			 			}
			 		});
					res.error(function(data, status, headers, config) {
						notif({
							  type: "error",
							  msg: mesaages.error,
							  position: "center",
							  multiline : true,
							  timeout: 6000
							});
					});	
	    		    }
	        	});
       	 }
	        
       }
       
       //window actions
//regulatory code ends here
       
/**
 * Case report changes
 */
       var isCaseReport=sessionStorage.getItem("caseReportApplication");  
       if(isCaseReport=='true'){
    	   $scope.hideWhenCaseReport=true;
    	   $scope.hideWhenItIsNotCaseReport=false;
       }else{
    	   $scope.hideWhenCaseReport=false;
    	   $scope.hideWhenItIsNotCaseReport=true;
       }
/**
 * Case report changes ends here
 */
       
       $scope.$on("callResearchDocumentSaveMethod", function(e) {
   		//$scope.callMethosStatus =$scope.autoSaveMethodCall();
   		$q.all($scope.autoSaveMethodCall(e)).then(function(data) {
   			$scope.getResult= sessionStorage.getItem("isCorrect");
   			if($scope.getResult == 'true'){
   				e.preventDefault();
   			}
   		});
   	});
   	$scope.autoSaveMethodCall = function(e) {
   		$q.all($scope.submit()).then(function(state) {
   			$scope.keyPressedForAutoSave = false;
   			sessionStorage.setItem("dataChange", $scope.keyPressedForAutoSave);
   		});
   	}
   	$scope.checkKeyForAutoSave = function() {
   		var ReadOnly = sessionStorage.getItem('isReadOnlyMode');
   		if (ReadOnly == 'false') {
   			$scope.keyPressedForAutoSave = true;
   			sessionStorage.setItem("dataChange", $scope.keyPressedForAutoSave);
   		}
   	}
   	/*$rootScope.getPageFieldChangeInBubbleForClaification = function(divId) {
		$('#'+divId+' div .hideIdSpan').each(function() {
		    var hastext = $(this).text();
		    hastext=parseInt(hastext);
		    for (var i in $rootScope.pageWiseChangeData) {
		    	 if ($rootScope.pageWiseChangeData[i].entityId == hastext) {
		    		 $(this).closest( "div" ).css("border", "red solid 1px");
		    		 //return false;
		    	 }
		    }
		});
	}*/
   	$scope.setFiledChangedInPage = function(divId,data) {
   		$rootScope.resetBackgroundColorOfClarification();
	    $scope.testCount = 0;
	    for (var i in $rootScope.pageWiseChangeData) {
	    	 if ($rootScope.pageWiseChangeData[i].entityId == data.row_id) {
			           var auditChangeDiff="auditChangeDiff"+i;
			           $scope.tempOldVal="auditChangeDiff"+i
			           $scope[auditChangeDiff]=$rootScope.pageWiseChangeData[i];
	           			$("#"+$rootScope.pageWiseChangeData[i].viewId+"").css("background-color", "#f2dede");
	           			var divHTMLContentForAuditIcon="<div id='changesFromAuditRfcDivId_" + i + "'><span class='input-group-addon  secondiconclassmodal'><i data-toggle='modal' ng-click='showOldChangeValue("+$scope.tempOldVal+")' data-target='#modal-info' class='fa fa-info-circle' style='color:orange; cursor: pointer;'></i></span></div>"
	           			$('#'+$rootScope.pageWiseChangeData[i].viewId+'').append(divHTMLContentForAuditIcon);
	           			$compile($('#changesFromAuditRfcDivId_'+ i +''))($scope);
	    	 }
	    }
	}
   	
   	$scope.closeDocumentHistory=function(){
   		$scope.isDocumentHistoryModal=false;
   	}
   	
   	
    $scope.setIsAdHocDocForm=function(){
 	   $scope.isResearchDocument=false;
 	   $scope.isFundingRelatedDocsForm=false;
 	   $scope.isLegalRelatedDocsForm=false;
 	   $scope.isinstApprovalDocForm=false;
 	   $scope.isregulatoryDocForm=false;
 	   $scope.isAdHocDocmentForm =true;
 		highlightTableRowService.removeHighlight();
 		 angular.element("input[type='file']").val(null);
 		 $scope.disableIfDocIsStamped=false;
 		 if ($scope.functionId == "RSP" || $scope.amdSerialNo>0) {
		     	$rootScope.getPageFieldChangeInBubbleForClaification('researchRegulatoryDocsBubble');
		     }
    }
    
    var isMemoSubmission=sessionStorage.getItem("memoSubmissionApplication");  
    if(isMemoSubmission=='true'){
 	   $scope.hideWhenCaseReport=true;
 	   $scope.hideWhenItIsNotCaseReport=true;
 	   $scope.hideWhenAdHocDoc = false;
 	  $scope.setIsAdHocDocForm();
 	   
    }else{
    	 $scope.hideWhenAdHocDoc = true;
    }
    
    //ad-hoc document section
    $scope.addAddHOCDocumentsData=function(){
   		var defer = $q.defer();
   		$scope.isSave=completionCheckService.saveForLaterCheck(messages.validateSaveForLaterForAdHocRelated,messages.validateSaveForLaterForAdHocRelated);
   		if(!$scope.isSave){
 		   return false;
 	   }	
   		var file = $scope.ad_hoc_doc_file;
 			if(file!=undefined && file!="" && file!="No file"){
 				var type=file;
 				var array=[];
 				var result="";
 				var typesAllowedInUpload=messages.typeOfDocsToUpload;
 				
 				array=typesAllowedInUpload.split(",");
 				
 				for (var i = 0; i < file.length; i++) {
 					for(var j=0;j<array.length;j++){
 						if(file[i].type == array[j]){
 	  						result="success";
 	  						break ;
 	  					}else{
 	  					result="";
 	  					}
 					}
 					
 				}
 				if(result!="success" && type!=""){
 					 notif({
 							type : "warning",
 							msg : messages.uploadFilesWarning,
 							position : "center",
 							multiline: true,
 							timeout : 6000,
 							autohide: true
 						});
 					defer.reject('false');
 					sessionStorage.setItem("isCorrect", 'false');
 					 return false;
 				}
 				$scope.isSpecialChar= documentValidation.checkForSpecialCharMulti(file);
 				$scope.isSpecialChar= documentValidation.checkForDocumentNameLenghtMulti(file);
 				
 				var size=file.size+"";
 				var testsize=messages.maxsize; 
 				if(Number(testsize)<Number(size)){
 							testsize = testsize/1024;
 							testsize=testsize/1024;
 							notif({
 								type : "warning",
 								msg : messages.configSize+testsize+".MB",
 								position : "center",
 								multiline: true,
 								timeout : 6000,
 								autohide: true
 							});
 							defer.reject('false');
 							sessionStorage.setItem("isCorrect", 'false');
 						 return false; 			
 						}
 			 }else{
 			 }
 			if($scope.ad_hoc_doc_pages=="" || $scope.ad_hoc_doc_pages==undefined || $scope.ad_hoc_doc_pages==null){
				notif({
					type : "warning",
					msg : "Please enter document pages",
					position : "center",
					multiline: true,
					timeout : 6000,
					autohide: true
				});
				return false;
			} if($scope.ad_hoc_doc_pages==0 || $scope.ad_hoc_doc_pages<0){
				notif({
					type : "warning",
					msg : "Document pages should be greater than 0",
					position : "center",
					multiline: true,
					timeout : 6000,
					autohide: true
				});
				return false;
			}
 	    	var documentsData={
 	    			document_type:			$scope.ad_hoc_doctype,
 	    			document_description:	$scope.ad_hoc_doc_description,
 	    			language:				$scope.ad_hoc_doc_language,
 	    			pages:					""+$scope.ad_hoc_doc_pages,
 	    			document_category:		"DOC_CATG_021",
 	    			research_id:			""+$rootScope.researchApplicationId,
 	    			no_of_documents:parseInt(($scope.ad_hoc_doc_file == undefined ? 1 : $scope.ad_hoc_doc_file.length)),
 	    	}
 	    	$scope.functionId = sessionStorage.getItem("functionId");
            $scope.reqtHrdIdTemp= parseInt(sessionStorage.getItem("rfcHrdId"));
            if(isNaN($scope.reqtHrdIdTemp)){
            	$scope.reqtHrdIdTemp=1;
            }
            documentsData['functionId'] = $scope.functionId;
            documentsData['reqtHrdId'] = $scope.reqtHrdIdTemp;
 			    		 var res = $http.post('save-documents-data', documentsData);
 			        	 res.success(function(data, status, headers, config) {
 			        		 if(data>0){
 			        			defer.resolve('true');
 			        			sessionStorage.setItem("isCorrect", 'true');
 			        			$scope.keyPressedForAutoSave = false;
 			        			sessionStorage.setItem("dataChange", $scope.keyPressedForAutoSave);
 			        			 var myCallback = function(){
 			        				 if($scope.ad_hoc_doc_file != "" && $scope.ad_hoc_doc_file != undefined && $scope.ad_hoc_doc_file!="No file"){
 			        					 $scope.adHocUploadFile("ad_hoc_related").then(function(){
 			        						if($scope.adHoResult){
 												notif({
 													type : "success",
 													msg : messages.resDocUpdateSuccess,
 													position : "center",
 													multiline: true,
 													timeout : 6000,
 													autohide: true,
 													
 												});
 												$scope.checkForErrorInApplication();
 												$scope.NavigateToNextTab();
 												$scope.resetAdHocDocumentsData();
 											}else if (typeof $scope.adHoResult === 'string' || $scope.adHoResult instanceof String){
									  			  if(data.search("The requested URL was rejected") > -1){
 									 				  var supportId = data.match(/\d/g);
 									 				  var errorObject = {
 									  						title :"Error",
 									  						content : '<p class="alert  text-center">Firewall getting blocked. <br />Please contact MRC with screen shot & Send a mail to <b>AbhathSupport@hamad.qa</b> with below support ID<br /><b>Your support ID is :'+supportId.join("")+'</b>.</p>'
 									  				  };
 									  				  ResearchApplicationModalService.openCustomAlertMessage(errorObject);
 									  		 		
 									 			  }
 									 		  }else{
 												notif({
 													type : "error",
 													msg : "Document Not uploaded. Please Contact Admin",
 													position : "center",
 													multiline: true,
 													timeout : 6000,
 													autohide: true,
 													
 												});
 											}
 			        						
 			        					 });
 			        				 	}else{
 			        				 		$scope.genericMethod();
 			        				 	}
 			          			     }
 			        			$scope.NavigateToNextTab();
 			        			 myCallback();
 			        				$scope.genericMethod();
 			        				$scope.getBannerDataFromService();
 			        		 }else if (typeof data === 'string' || data instanceof String){
					  			  if(data.search("The requested URL was rejected") > -1){
						 				  var supportId = data.match(/\d/g);
						 				  var errorObject = {
						  						title :"Error",
						  						content : '<p class="alert  text-center">Firewall getting blocked. <br />Please contact MRC with screen shot & Send a mail to <b>AbhathSupport@hamad.qa</b> with below support ID<br /><b>Your support ID is :'+supportId.join("")+'</b>.</p>'
						  				  };
						  				  ResearchApplicationModalService.openCustomAlertMessage(errorObject);
						  		 		
						 			  }
						 		  }else{
 			        			 notif({
 			        					type : "error",
 			        					msg : messages.resDocSaveError,
 			        					position : "center",
 			        					multiline : true,
 			        					timeout : 6000
 			        				});
 			        		 }
 			        		
 			        			
 			        	 });
 			        	 res.error(function(data, status, headers, config) {
 			        	});
 		return defer.promise;
   }//adding new record code ends here
    //update code
    $scope.updateAdHOCDocumentsData=function(form){
  	  var defer = $q.defer();
  	$scope.isAdHocDocumentNameExistsInUpdate=false;
		for(var i in $scope.AdHocDocuments){
			if($scope.ad_hoc_doc_file!=undefined && $scope.ad_hoc_doc_file!=''){
				for(var j=0;j<$scope.ad_hoc_doc_file.length;j++){
					if($scope.ad_hoc_doc_file[j].name == $scope.AdHocDocuments[i].file_noHref){
	  	  				$scope.isAdHocDocumentNameExistsInUpdate=true;
	  	  			}	
				}
				
			}
		}
		if($scope.ad_hoc_doc_pages=="" || $scope.ad_hoc_doc_pages==undefined || $scope.ad_hoc_doc_pages==null){
			notif({
				type : "warning",
				msg : "Please enter document pages",
				position : "center",
				multiline: true,
				timeout : 6000,
				autohide: true
			});
			return false;
		} if($scope.ad_hoc_doc_pages==0 || $scope.ad_hoc_doc_pages<0){
			notif({
				type : "warning",
				msg : "Document pages should be greater than 0",
				position : "center",
				multiline: true,
				timeout : 6000,
				autohide: true
			});
			return false;
		}
		if(!$scope.isAdHocDocumentNameExistsInUpdate){
			 var documentsData={
	   			   document_type:			$scope.ad_hoc_doctype,
	   				document_description:	$scope.ad_hoc_doc_description,
	   				language:				$scope.ad_hoc_doc_language,
	   				pages:					""+$scope.ad_hoc_doc_pages,
	   				document_category:		"DOC_CATG_021",
	   				research_id:			""+$rootScope.researchApplicationId,
	   				research_doc_id:		""+$scope.row_id,
	   			no_of_documents:parseInt(($scope.ad_hoc_doc_file==undefined?1:$scope.ad_hoc_doc_file.length)),
	   	   }
	   	var file = $scope.ad_hoc_doc_file;
	   	if(file!=undefined && file!="" && file!="No file"){
			var type=file;
			var array=[];
			var result="";
			var typesAllowedInUpload=messages.typeOfDocsToUpload;
			
			array=typesAllowedInUpload.split(",");
			
			for(var i=0;i<file.length;i++){
				for (var j = 0; j < array.length; j++) {
	  				if(file[i].type == array[j]){
	  					result="success";
	  					break;
	  				}else{
	  				result="";
	  				}
	  			}
			}
			
			if(result!="success"&& type!=""){
				 notif({
						type : "warning",
						msg : messages.uploadFilesWarning,
						position : "center",
						multiline: true,
						timeout : 6000,
						autohide: true
					});
				 return false;
				defer.reject('false');
				sessionStorage.setItem("isCorrect", 'false');
			}
			$scope.isSpecialChar= documentValidation.checkForSpecialCharMulti(file);
			$scope.isSpecialChar= documentValidation.checkForDocumentNameLenghtMulti(file);
			var size=file.size+"";
			var testsize=messages.maxsize; 
			if(Number(testsize)<Number(size)){
						testsize = testsize/1024;
						testsize=testsize/1024;
						notif({
							type : "warning",
							msg : messages.configSize+testsize+".MB",
							position : "center",
							multiline: true,
							timeout : 6000,
							autohide: true
						});
					 return false; 	
					defer.reject('false');
					sessionStorage.setItem("isCorrect", 'false');
					}
		 }
		   var document_type_exits = $scope.funding_doctype;
			var document_message=mesaages.editrow;

			angular.forEach($scope.AdHocDocuments, function(value, key){
			      if(value.doc_type == document_type_exits && value.row_id!=$scope.row_id){
			    	  document_message = document_type_exits + messages.researchupload;
			    	  document_type_exits = "";
			    	  
			      }
			   });

	   	
	   	  // $.confirm({
	   		   // title: mesaages.areusure,
	   		   // content_box: document_message,
	   		    //confirm: function(){
	   	   var file = $scope.ad_hoc_doc_file;
	   	   angular.forEach(form, function(obj) {
	   			if (angular.isObject(obj)
	   					&& angular.isDefined(obj.$setDirty)) {
	   				obj.$setDirty();
	   			}
	   		})
	   		if (form.$valid) {
	   		$scope.functionId = sessionStorage.getItem("functionId");
          $scope.reqtHrdIdTemp= parseInt(sessionStorage.getItem("rfcHrdId"));
          if(isNaN($scope.reqtHrdIdTemp)){
          	$scope.reqtHrdIdTemp=1;
          }
          documentsData['functionId'] = $scope.functionId;
          documentsData['reqtHrdId'] = $scope.reqtHrdIdTemp;
	   	   var res = $http.post('save-documents-data', documentsData);
	   		 res.success(function(data, status, headers, config) {
	        		 if(data>0){
		        			defer.resolve('true');
		        			sessionStorage.setItem("isCorrect", 'true');
		        			$scope.keyPressedForAutoSave = false;
		        			sessionStorage.setItem("dataChange", $scope.keyPressedForAutoSave);
		        			 var myCallback = function(){
		        				 if($scope.ad_hoc_doc_file != "" && $scope.ad_hoc_doc_file != undefined && $scope.ad_hoc_doc_file!="No file"){
		        					 $scope.adHocUploadFile("ad_hoc_related").then(function(){
		        						 if($scope.adHoResult){
												notif({
													type : "success",
													msg : messages.resDocUpdateSuccess,
													position : "center",
													multiline: true,
													timeout : 6000,
													autohide: true,
													
												});
												$scope.checkForErrorInApplication();
												$scope.NavigateToNextTab();
												$scope.resetAdHocDocumentsData();
											}else if (typeof $scope.adHoResult === 'string' || $scope.adHoResult instanceof String){
									  			  if(data.search("The requested URL was rejected") > -1){
									 				  var supportId = data.match(/\d/g);
									 				  var errorObject = {
									  						title :"Error",
									  						content : '<p class="alert  text-center">Firewall getting blocked. <br />Please contact MRC with screen shot & Send a mail to <b>AbhathSupport@hamad.qa</b> with below support ID<br /><b>Your support ID is :'+supportId.join("")+'</b>.</p>'
									  				  };
									  				  ResearchApplicationModalService.openCustomAlertMessage(errorObject);
									  		 		
									 			  }
									 		  }else{
												notif({
													type : "error",
													msg : "Document Not uploaded. Please Contact Admin",
													position : "center",
													multiline: true,
													timeout : 6000,
													autohide: true,
													
												});
											}
		        					 });
		        				 	}else{
		        				 		$scope.genericMethod();
		        				 	}
		          			     }
		        			$scope.NavigateToNextTab();
		        			 myCallback();
		        				$scope.genericMethod();
		        				$scope.getBannerDataFromService();
		        		 }else if (typeof data === 'string' || data instanceof String){
				  			  if(data.search("The requested URL was rejected") > -1){
				 				  var supportId = data.match(/\d/g);
				 				  var errorObject = {
				  						title :"Error",
				  						content : '<p class="alert  text-center">Firewall getting blocked. <br />Please contact MRC with screen shot & Send a mail to <b>AbhathSupport@hamad.qa</b> with below support ID<br /><b>Your support ID is :'+supportId.join("")+'</b>.</p>'
				  				  };
				  				  ResearchApplicationModalService.openCustomAlertMessage(errorObject);
				  		 		
				 			  }
				 		  }else{
		        			 notif({
		        					type : "error",
		        					msg : messages.resDocSaveError,
		        					position : "center",
		        					multiline : true,
		        					timeout : 6000
		        				});
		        		 }
		        		
		        			
		        	 });
	   		 res.error(function(data, status, headers, config) {
	   		});	
	   		}
	     // }
	  // });
		}else{
			notif({
						type : "error",
						msg : messages.uploadFileAlreadyExists,
						position : "center",
						multiline : true,
						timeout : 6000
					});
			defer.reject('false');
			sessionStorage.setItem("isCorrect", 'false');
		}
		return defer.promise;
    }
    //window actions
    window.adHocActionEvents = {
	         'click .edit': function (e, value, row,index) {
	         	$.confirm({
	     		    title: mesaages.areusure,
	     		    content_box: mesaages.editrow,
	     		    confirm: function(){
	     		    highlightTableRowService.highlightcolor(e);
	     		    	$scope.adHocDocDisable=true;
	     		    $scope.updateAdHocForm=true
	     		    	 $scope.selected = row;
	     				 $scope.indexvalue=index;
	     				$scope.ad_hoc_doctype=$scope.selected.doc_type_codeSet;
	     				$scope.ad_hoc_doc_description=$scope.selected.doc_desc;
	     				$scope.ad_hoc_doc_language=$scope.selected.language;
	     				$scope.ad_hoc_doc_pages=$scope.selected.pages;
	     				$scope.ad_hoc_doc_file_nohref= $scope.selected.file_noHref;
	     				$scope.row_id= $scope.selected.row_id;
	     				$scope.$apply();
	     			$("#adhoc_docs_table").css({ display: "block" });
	     			$( ".back-to-top" ).trigger( "click" );
	     		    }
	         	});
	         },
	         'click .remove': function (e, value, row,index) {
	        	$scope.isAlloedToDelete=true;
	        	 $.each($scope.dataInsertedByWorkFlow,function(key,value){
	        		 if(row.row_id==value.docId){
	        			 notif({
	 						  type: "warning",
	 						  msg: messages.deleteRestrict,
	 						  position: "center",
	 						  multiline : true,
	 						  timeout: 6000
	 						});
	        			 $scope.isAlloedToDelete=false;
	        			 return false;
	        		 }
	        	 });
	        	 if($scope.isAlloedToDelete==true){
		  			$.confirm({
	    		    title: mesaages.areusure,
	    		    content_box: mesaages.deleterow,
	    		    confirm: function(){
	    		    	$scope.showorhideupdate=true;
	    		    	$scope.showorhideadd=false;
	    		    	 $scope.selected = row;
		           	var dataObj={
		           			research_doc_id:		""+$scope.selected.row_id,
					};
			   		
			   		var res = $http.post('remove-res-docs', dataObj);
					 res.success(function(data, status, headers, config) {
			 			$scope.message = data ;
			 			if($scope.message == true){
			 				 	
			 				 	 notif({
			 						  type: "success",
			 						  msg: messages.deletedsuccessfully,
			 						  position: "center",
			 						  multiline : true,
			 						  timeout: 6000
			 						});
			 				 $scope.resetAdHocDocumentsData();
		    				$scope.genericMethod();
			 			}else{
			 				 notif({
			 					  type: "error",
			 					  msg: messages.contactadmin,
			 					  position: "center",
			 					  multiline:true,
			 					  timeout: 6000
			 					});
			 			}
			 		});
					res.error(function(data, status, headers, config) {
						notif({
							  type: "error",
							  msg: mesaages.error,
							  position: "center",
							  multiline : true,
							  timeout: 6000
							});
					});	
	    		    }
	        	});
	        	 }
	        }
	};
    
    $scope.fillDataIntoAdHocForm=function(row){
    	$.confirm({
    		    title: mesaages.areusure,
    		    content_box: mesaages.editrow,
    		    confirm: function(){
    		    	if ($scope.functionId == "RSP") {
               		 $scope.setFiledChangedInPage('HACView_Ad_Hoc_documents_related_table',row);
                   }
    		    	$scope.updateshow=true;
    		   	$scope.cancelshow=true;
    		   	$scope.addshow=false;
    		    	 $scope.selected = row;
    		    		$scope.ad_hoc_doctype=$scope.selected.doc_type_codeSet;
	     				$scope.ad_hoc_doc_description=$scope.selected.doc_desc;
	     				$scope.ad_hoc_doc_language=$scope.selected.language;
	     				$scope.ad_hoc_doc_pages=$scope.selected.pages;
	     				$scope.ad_hoc_doc_file_nohref= $scope.selected.file_noHref;
      				$scope.row_id= $scope.selected.row_id;
      				$scope.uploadedFileName=$scope.selected.file_noHref;
      				$scope.updateAdHocForm=true;
      				completionCheckService.resetField(messages.validateSaveForLaterForAdHocRelated);
      				$scope.$apply();
    				$("#adhoc_docs_table").css({ display: "block" });
    				$( ".back-to-top" ).trigger( "click" );
    		    }
     	});
    }
    function getFileExtenstion(fname) {
    	var extension ="";
    	if(fname != undefined && fname != null && fname != ""){
    		var pos = fname.lastIndexOf(".");
      	  var strlen = fname.length;
      	  if (pos != -1 && strlen != pos + 1) {
      	    var ext = fname.split(".");
      	    var len = ext.length;
      	    var extension = ext[len - 1].toLowerCase();
      	  } else {
      	    extension = "No extension found";
      	  }
    	}else{
    		extension ="";
    	}
    	  return extension;
    }
   	
}]);
function actionFormatterForDocumentationTab() {
    return [
        '<a class="edit btn btn-yellow btn-sm mit-yellow-btn" style="padding: 4px;margin: 3px;padding-right: 1px;"  title="Update Item"><i class="glyphicon glyphicon-edit"></i></a><a class="remove btn btn-red btn-sm mit-red-btn" style="padding: 4px;margin: 3px;padding-right: 1px;"  title="Delete Item"><i class="glyphicon glyphicon-trash"></i></a>',

    ].join('   ');
}