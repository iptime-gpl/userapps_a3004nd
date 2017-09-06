SOURCE_PATH=/home/`whoami`/MarvellNas/source
CROSS_COMPILE=arm-mv5sft-linux-gnueabi
ToolChainInclude="/opt/sdk/targets/arm-mv5sft-linux-gnueabi/cross/arm-mv5sft-linux-gnueabi/sys-root/usr/include"
ToolChainLib="/opt/sdk/targets/arm-mv5sft-linux-gnueabi/cross/arm-mv5sft-linux-gnueabi/sys-root/usr/lib"
./configure --host=${CROSS_COMPILE} --target=${CROSS_COMPILE} --build=i686-pc-linux \
		   CC=${CROSS_COMPILE}-gcc \
		   CXX=${CROSS_COMPILE}-g++ \
		   LIBS="-lefm -lglib" \
		   CFLAGS="-I${TOP_ROOT}/include -I${TOP_SRC}/base-devel.v2/include/export -DUSE_EFMLOG -DUSE_IPTIME_WELCOME -DSERVICE_COMPILE=1 -DHAVE_LC_MESSAGES" \
		   LDFLAGS="-L${TOP_ROOT}/lib -L${TOP_SRC}/base-devel.v2/libs -L${TOP_SRC}/glib-1.2.10/.libs" \
		   --sbindir=/usr/hddapp/sbin \
		   --sharedstatedir=/usr/share \
		   --localstatedir=/var/run \
		   --sysconfdir=/etc \
		   --enable-autoshadow \
		   --disable-cap \
		   --disable-auth-file \
		   --disable-auth-pam \
		   --enable-largefile \
		   --with-libraries=${ToolChainLib}/openssl \
		   --with-includes=${ToolChainInclude}/openssl:${TOP_SRC}/base-devel.v2/include \
		   --with-modules=mod_codeconv:mod_df:mod_tls \
		   --enable-nls \
		   --prefix=`pwd`/install
#		   --with-modules=mod_codeconv:mod_df:mod_tls \
#		   LDFLAGS="-L${TOP_ROOT}/lib -L${TOP_SRC}/base-devel.v2/libs -L${TOP_SRC}/glib-1.2.10/.libs" \
#		   --with-includes=${ToolChainInclude}/openssl \
#		   --with-libraries=${ToolChainLib}/openssl:${TOP_ROOT}/lib:${TOP_SRC}/base-devel.v2/efmlib/src:${TOP_SRC}/glib-1.2.10/.libs \
#--with-modules=mod_facts \
