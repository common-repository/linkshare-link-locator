<?php
/*
Plugin Name: LinkShare-Link-Lookup		
Version: 0.1
Plugin URI: http://www.wayner.org/wp/
Description: Use LinkShare's LinkFinder and LinkGenerator services to pull up deals.
Author: Peter Wayner
Author URI: http://www.wayner.org/wp/

LinkShare Link Lookup
Copyright (C) 2005-2007 Rich Manalang -- Changes Copyright 2008 Peter Wayner
Version 0.1  $Rev: 1 $ $Date: 2008-10-20  $

This program is free software; you can redistribute it and/or
modify it under the terms of the GNU General Public License as
published by the Free Software Foundation; either version 2 of the
License, or (at your option) any later version.

This program is distributed in the hope that it will be useful, but
WITHOUT ANY WARRANTY; without even the implied warranty of
MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the GNU
General Public License for more details.

You should have received a copy of the GNU General Public License
along with this program; if not, write to the Free Software
Foundation, Inc., 59 Temple Place, Suite 330, Boston, MA 02111-1307
USA
 */

class WP_LinkShare_Link_Lookup {

  var $version;
  var $country;
  var $associate_id;
  var $subscription_id;
  var $plugin_home_url;

  function wp_linkshare_link_lookup () {
    // load i18n translations
    load_plugin_textdomain('linkshare-link-lookup');

    // initialize all the variables
    $this->version = '0.1';
    $this->plugin_home_url = 'http://www.wayner.org/wp';
    $this->associate_id = get_option('linksharelflg_associate_id');

  }

  function check_for_updates() {
    $request  = "GET http://svn.wp-plugins.org/linkshare-link-lookup/trunks/latest-version.txt HTTP/1.1\n";
    $request .= "Host: svn.wp-plugins.org\n";
    $request .= "Referer: " . $_SERVER["SCRIPT_URI"] . "\n";
    $request .= "Connection: close\n";
    $request .= "\n";

    $fp = fsockopen("svn.wp-plugins.org", 80);
    fputs($fp, $request);
    while(!feof($fp)) {
      $result .= fgets($fp, 128);
    }
    fclose($fp);

    $result = split("\r\n", $result);

    foreach($result as $k) {
      if(!strncmp($k, "Version: ", 9)) {
        $result = $k;
        break;
      }
    }

    $version = split(": ", $k);
    $version = $version[1];

    return $version;
  }

  function options_page() {

    if(isset($_POST['submitted'])) {

      update_option('linksharelflg_associate_id', $_POST['linksharelflg_associate_id']);

      //get any new variables
      $this->wp_amazon();

      echo '<div class="updated"><p><strong>' . __('Options saved.', 'linksharelflg') . '</strong></p></div>';
    }
    $this->linkShareToken=get_option('flickrRSS_flickrid'); 
    $this->associate_id = get_option('linksharelflg_associate_id');
    $var[$this->country] = "selected";

    $formaction = $_SERVER['PHP_SELF'] . "?page=wp-linkshare-link-lookup/wp-linkshare-link-lookup.php";

    // Check if there is a new version of WP-Amazon
    $version_synch_val = get_option('linksharelflg_check_version');

    if ( empty($version_synch_val) )
      add_option('linksharelflg_check_version', '0');

    if (get_option('linksharelflg_check_version') < ( time() - 1200 ) ) {
      $latest_version = $this->check_for_updates();
      update_option('linksharelflg_check_version', time());
      update_option('linksharelflg_latest_version', $latest_version);
    } else {
      $latest_version = get_option('linksharelflg_latest_version');
    }

    if ($this->version != $latest_version )
      $update = "<a href=\"$this->plugin_home_url\" style=\"color:red\">Click here to get the latest update.</a>";

    // Start outputting XHMTL
?>
        <div class="wrap">
            <h2><?php _e('General Options', 'linksharelflg'); ?></h2>

            <form name="linksharelflg_options" method="post" action="<?php echo $formaction; ?>">
            <input type="hidden" name="submitted" value="1" />
            <h3> Use </h3>
<img src="../wp-content/plugins/wp-linkshare-link-lookup/images/wpaopen.png">
    Just click on LinkShare logo that will appear next to the editor for creating new posts. This opens a side bar that lets
 you search the LinkShare databases for commission paying links in two different ways. The first lets you convert a URL from
the merchant's site into a commission paying link. The second lets you search for items by keywords.
<br>
            <fieldset class="linkshare">
                <h3> LinkShare Token</h3>
                <input type="text" size="60" name="linksharetoken" value="<?php echo get_option('flickrRSS_flickrid'); ?>">
</fieldset>
Get your LinkShare token from <a href="http://cli.linksynergy.com/cli/publisher/links/webServices.php"> here</a>.
 
              

            <p><?php printf(__('This version of LinkShare Lookup is %1$s and the latest version is %2$s. %3$s', 'linksharelflg'), $this->version, $latest_version, $update); ?></p>

            <p class="submit">
                <input type="submit" name="Submit" value="<?php _e('Update Options &raquo;', 'linksharelflg'); ?>" />
            </p>
        </form>
 
        </div>

<?php
  }

  // Adds javascript function to launch a new window for the search page
  function add_head() {
    if (!(strstr($_SERVER['PHP_SELF'], 'post-new.php') || strstr($_SERVER['PHP_SELF'], 'page-new.php')
      || strstr($_SERVER['PHP_SELF'], 'post.php') || strstr($_SERVER['PHP_SELF'], 'page.php')))
        return 0;
?>
            <link rel="stylesheet" href="../wp-content/plugins/wp-linkshare-link-lookup/css/wp-linksharelflg.css" type="text/css" />
    <script type="text/javascript">
<?php
    echo("var wpa2AssociatesId = '" . $this->associate_id . "';");
    echo("var wpa2CountryTLD = '" . $this->country . "';");
?>
    </script>
            <script type="text/javascript" src="../wp-content/plugins/wp-linkshare-link-lookup/js/wp-linksharelflg.js"></script>
            <script type="text/javascript" src="../wp-content/plugins/wp-linkshare-link-lookup/js/dimensions.js"></script>
<?php
  }

  function show_options_page() {
    global $wp_linkshare_link_lookup;
    add_options_page(__('WP LinkShare Link Lookup Options', 'linksharelflg'), __('LinkShare Lookup', 'linksharelflg'), 8, __FILE__, array(&$wp_linkshare_link_lookup, 'options_page'));
  }


function myplugin_ajax_linkgenerator_lookup()
{
  // read submitted information
  $mid=$_POST['mid'];
  $proxy_url=$_POST['url'];
  //$token=get_option('flickrRSS_flickrid'); 
  $token='458ef4b3c965e85e6342287195d652241a6d9232f522cae274898ed102a60964';
  // Build Snoopy URL request

  require_once( ABSPATH . WPINC . '/class-snoopy.php' );
  $sno = new Snoopy();
  $sno->agent = 'WordPress/' . $wp_version;
  $sno->read_timeout = 2;
  $reqURL="http://feed.linksynergy.com/createcustomlink.shtml?token=".$token."&mid=".$mid."&murl=".$proxy_url;

  // Send request to elevation server 
  if( !$sno->fetchtext( $reqURL )) {
    die( "alert('Could not connect to lookup host.')" );
  } 


  // Compose JavaScript for return
  die($sno->results);
} // end of myplugin_axax_linkgenerator_lookup function

function myplugin_ajax_linkfinder_lookup()
{
  // read submitted information
  $mid=$_POST['mid'];
  $keyword=$_POST['keyword'];
  //$token=get_option('flickrRSS_flickrid'); 
  $token='458ef4b3c965e85e6342287195d652241a6d9232f522cae274898ed102a60964';
  // Build Snoopy URL request

  require_once( ABSPATH . WPINC . '/class-snoopy.php' );
  $sno = new Snoopy();
  $sno->agent = 'WordPress/' . $wp_version;
  $sno->read_timeout = 2;
  $reqURL="http://feed.linksynergy.com/productsearch?t=1&token=".$token."&mid=".$mid."&keyword=".$keyword;

  // Send request to elevation server
  if( !$sno->fetch( $reqURL )) {
    die( "alert('Could not connect to lookup host.')" );
  }

  header("Content-type: text/xml");
  // Compose JavaScript for return
  die($sno->results);
} // end of myplugin_axax_linkfinder_lookup function


 


function myplugin_js_admin_header() // this is a PHP function
{
  // use JavaScript SACK library for Ajax
  wp_print_scripts( array( 'sack' ));

  // Define custom JavaScript function
?>
<script type="text/javascript">
//<![CDATA[
function myplugin_linkgenerator( ) {
  var mid=$('merchant').value;
  var url=$('ls-url').value;
   var mysack = new sack( 
       "<?php bloginfo( 'wpurl' ); ?>/wp-admin/admin-ajax.php" );    

  mysack.execute = 1;
  mysack.method = 'POST';
  mysack.setVar( "action", "myplugin_linkgenerator_lookup" );
  mysack.setVar( "mid", mid );
  mysack.setVar( "url", url );
  mysack.encVar( "cookie", document.cookie, false );
  mysack.onError = function() { alert('Ajax error in looking up LinkGenerator' )};
  mysack.runAJAX();

  return true;
} // end of JavaScript function myplugin_ajax_elevation

function myplugin_linkgenerator( ) {
  var mid=$('merchant').value;
  var url=$('ls-url').value;
   var mysack = new sack(
       "<?php bloginfo( 'wpurl' ); ?>/wp-admin/admin-ajax.php" );

  mysack.execute = 1;
  mysack.method = 'POST';
  mysack.setVar( "action", "myplugin_linkgenerator_lookup" );
  mysack.setVar( "mid", mid );
  mysack.setVar( "url", url );
  mysack.encVar( "cookie", document.cookie, false );
  mysack.onError = function() { alert('Ajax error in looking up LinkFinder' )};
  mysack.runAJAX();

  return true;
} // end of JavaScript function myplugin_ajax_elevation




//]]>
</script>
<?php
} // end of PHP function myplugin_js_admin_header








} // Class WP_LinkShare_Link_Lookup







// Add actions to call the function

add_action('admin_print_scripts', array(&$wp_linkshare_link_lookup,'myplugin_js_admin_header' ));

add_action('plugins_loaded', create_function('$a', 'global $wp_linkshare_link_lookup; $wp_linkshare_link_lookup = new WP_LinkShare_Link_Lookup;'));
add_action('admin_head', array(&$wp_linkshare_link_lookup, 'add_head'));
add_action('admin_menu', array(&$wp_linkshare_link_lookup, 'show_options_page'));
add_action('wp_ajax_frag','test');
add_action('wp_ajax_myplugin_linkgenerator_lookup', array(&$wp_linkshare_link_lookup,'myplugin_ajax_linkgenerator_lookup') );
add_action('wp_ajax_myplugin_linkfinder_lookup', array(&$wp_linkshare_link_lookup,'myplugin_ajax_linkfinder_lookup') );



?>
