/**
 * Created by lyan2 on 16/12/14.
 */
export function checkPermissions (){

    var permissionsToRequest = [];

    // check WRITE_EXTERNAL_STORAGE permission
    var storagePermission = "android.permission.WRITE_EXTERNAL_STORAGE";
    var hasStoragePermission = Ti.Android.hasPermission(storagePermission);

    if(!hasStoragePermission){
        permissionsToRequest.push(storagePermission);
    }

    // check ACCESS_COARSE_LOCATION permission
    var locationPermission = "android.permission.ACCESS_COARSE_LOCATION";
    var hasLocationPermission = Ti.Android.hasPermission(locationPermission);

    if(!hasLocationPermission){
        permissionsToRequest.push(locationPermission);
    }

    // check ACCESS_FINE_LOCATION permission
    var location2Permission = "android.permission.ACCESS_FINE_LOCATION";
    var hasLocation2Permission = Ti.Android.hasPermission(location2Permission);

    if(!hasLocation2Permission){
        permissionsToRequest.push(location2Permission);
    }

    // request permission
    Ti.Android.requestPermissions(permissionsToRequest, function(e) {
        if (e.success) {
            Ti.API.info("SUCCESS");
            callback();
        } else {
            Ti.API.info("ERROR: " + e.error);
        }
    });
};