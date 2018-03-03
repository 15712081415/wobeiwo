<?php
/**
 * The template for displaying the footer
 *
 * Contains the closing of the "site-content" div and all content after.
 */
?>

<div class="friend_links">
	<h2>友情链接</h2>
	<ul class="links">
    <li><a href="http://www.todaytw.com/">今日台湾网</a></li>
	<?php //wp_list_bookmarks('title_li=&categorize=0'); ?>
	</ul>
</div>

<div class="footer">
	<p class="copyright">本网站提供新影视资源均系收集各大网站，本网站只提供web页面浏览服务，并不提供影片资源存储，也不参与任何视频录制、上传若本站收集的节目无意侵犯了贵司版权，请给2251209984@qq.com邮箱地址来信，我们将在第一时间删除相应资源 <a href="http://www.miitbeian.gov.cn/" rel="nofollow" title="工业和信息化部ICP/IP地址/域名信息备案管理系统"><?php echo get_option( 'zh_cn_l10n_icp_num' );?></a></p>
	<p>Copyright © 2015-2018 <a href="<?php echo $site_url; ?>"><?php bloginfo('name'); ?></a> All Rights Reserved.</p>
</div>

<?php //wp_footer(); ?>
<script type="text/javascript">
function addToFavorite() {
    var url = window.location;
    var title = document.title;
    var ua = navigator.userAgent.toLowerCase();
    if (ua.indexOf("360se") > -1) {
        alert("由于360浏览器功能限制，请按 Ctrl+D 手动收藏！");
    }
    else if (ua.indexOf("msie 8") > -1) {
        window.external.AddToFavoritesBar(url, title); //IE8
    }
    else if (document.all) {
  try{
   window.external.addFavorite(url, title);
  }catch(e){
   alert('您的浏览器不支持,请按 Ctrl+D 手动收藏!');
  }
    }
    else if (window.sidebar) {
        window.sidebar.addPanel(title, url, "");
    }
    else {
  alert('您的浏览器不支持,请按 Ctrl+D 手动收藏!');
    }
}
</script>
<?php echo get_num_queries(); ?>
</body>
</html>
