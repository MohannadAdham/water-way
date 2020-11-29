define([//Dojo
  'dojo/_base/declare', 
  'dojo/_base/lang',
  //Jimu
  'jimu/BaseWidget',
  'jimu/SelectionManager',
  'jimu/dijit/Message',
  'jimu/LayerInfos/LayerInfos',
  //Dijit
  'dijit/form/Select',
  //Custom classes
  './idWebMapLayers',
  //Esri
  'esri/tasks/query', 
  'esri/tasks/QueryTask',
  //Files
  'xstyle/css!./files/bootstrap.min.css',
  './files/jquery-3.3.1.min',
  './files/bootstrap.min',
  //domReady!
  'dojo/domReady!'
  ],
function(declare, lang,
   BaseWidget, SelectionManager, Message, LayerInfos,
   Select, idWebMapLayers, Query, QueryTask) {

return declare([BaseWidget], {

layerName: null,
layer: null,
field: null,
url: null,
uniqueValue: null,
selectionManager: SelectionManager.getInstance(),


startup: function(){
  this.inherited(arguments);
  this._setWidgetSize();
  // this._initLoadingShelter();
  this._initLayerChooser();
  // this._initButtons();
  // this._getSelectedFeatures();
},

_setWidgetSize: function(){
    var panel = this.getPanel();
    panel.position.height = 550;
    panel.setPosition(panel.position);
    panel.panelManager.normalizePanel(panel);
},


_initLayerChooser: function(){
  var idForChangeEvent = "layerChooserNodeEvent" 

  new idWebMapLayers({
    idForChangeEvent: idForChangeEvent,
    layerNode: "layerChooserNode",
    map: this.map,
    geometry: "*", //options: 'point', 'polygon', 'line', 'multiPatch' or '*'
    imageFolderUrl: this.folderUrl
  }) 
  this.layerName = dijit.byId(idForChangeEvent).value;
  this.layer = this.map.getLayer(this.layerName);
  this.url = this.layer.url;
},


_performQuery: function(){
    console.log(this.layer);  
    console.log(this.layer.getSelectedFeatures()); 
    selectedFeatures = this.layer.getSelectedFeatures();
    featuresToSelect = [];
    selectedFeatures.forEach(feature => {
      console.log(feature["attributes"]["SUBID"]);
      console.log(feature["attributes"]["Down_Strea"]);
      var downStream = feature["attributes"]["Down_Strea"].split(',').slice()
      console.log(downStream);
      featuresToSelect = featuresToSelect.concat(downStream);
    });
    // remove the zeros from the result
    featuresToSelect = featuresToSelect.filter((el) => {return el > 0})
    console.log(featuresToSelect);

    var query = new Query()
    console.log("SUBID IN (" + featuresToSelect.join(', ') + ")");
    query.where = "SUBID IN (" + featuresToSelect.join(', ') + ")";
    selecteFeatures = [];
    query.outFields = ["*"];
    new QueryTask(this.url).execute(query, lang.hitch(this, function(results){
      // this.selectionManager.setSelection(this.layer, results.features);
      this.selectionManager.addFeaturesToSelection(this.layer, results.features);
    }),function(error){
      new Message({
        message: "There was a problem selecting."
      });
    });
  },


_performQuery2: function(){
  console.log(this.layer);  
  console.log(this.layer.getSelectedFeatures()); 
  selectedFeatures = this.layer.getSelectedFeatures();
  featuresToSelect = [];
  selectedFeatures.forEach(feature => {
    console.log(feature["attributes"]["SUBID"]);
    console.log(feature["attributes"]["Main_U"]);
    var downStream = feature["attributes"]["Main_U"].split(',').slice()
    console.log(downStream);
    featuresToSelect = featuresToSelect.concat(downStream);
  });
  // remove the zeros from the result
  featuresToSelect = featuresToSelect.filter((el) => {return el > 0})
  console.log(featuresToSelect);
  if(featuresToSelect.length > 0){
    var query = new Query()
    console.log("SUBID IN (" + featuresToSelect.join(', ') + ")");
    query.where = "SUBID IN (" + featuresToSelect.join(', ') + ")";
    selecteFeatures = [];
    query.outFields = ["*"];
    new QueryTask(this.url).execute(query, lang.hitch(this, function(results){
      this.selectionManager.addFeaturesToSelection(this.layer, results.features);
    }),function(error){
      new Message({
        message: "There was a problem selecting."
      });
    });
  }
  },


_clearSelection: function(){
this.selectionManager.clearSelection(this.layer)
}
});
});
