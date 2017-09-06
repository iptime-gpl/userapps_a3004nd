SOURCE_PATH=/home/`whoami`/MarvellNas/source
CROSS_COMPILE=arm-mv5sft-linux-gnueabi
ToolChainInclude="/opt/sdk/targets/arm-mv5sft-linux-gnueabi/cross/arm-mv5sft-linux-gnueabi/sys-root/usr/include"
ToolChainLib="/opt/sdk/targets/arm-mv5sft-linux-gnueabi/cross/arm-mv5sft-linux-gnueabi/sys-root/lib"

./configure --host=${CROSS_COMPILE} --target=${CROSS_COMPILE} --build=i686-pc-linux \
		   CC=${CROSS_COMPILE}-gcc \
		   CXX=${CROSS_COMPILE}-g++ \
		   CLFAGS="static" \
		   CPPFLAGS="-DUSE_EFM -I${TOP_ROOT}/include" \
		   LDFLAGS="-L${TOP_ROOT}/lib" \
		   LIBS="-liconv -lrt" \
		   --enable-static \
		   --with-local-protocols="dnssd CUPS" \
		   --disable-dnssd \
		   --disable-shared \
		   --disable-dbus \
		   --disable-gssapi \
		   --disable-ssl \
		   --disable-pam \
		   --disable-largefile \
		   --disable-avahi \
		   --disable-launchd \
		   --disable-systemd \
		   --disable-browsing \
