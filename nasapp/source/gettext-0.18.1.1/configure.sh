SOURCE_PATH=/home/`whoami`/MarvellNas/source
CROSS_COMPILE=arm-mv5sft-linux-gnueabi
ToolChainPrefix="/opt/sdk/targets/arm-mv5sft-linux-gnueabi/cross/bin/arm-mv5sft-linux-gnueabi-"
ToolChainBin="/opt/sdk/targets/arm-mv5sft-linux-gnueabi/cross/bin/"
ToolChainInclude="/opt/sdk/targets/arm-mv5sft-linux-gnueabi/cross/arm-mv5sft-linux-gnueabi/sys-root/usr/include"
ToolChainLib="/opt/sdk/targets/arm-mv5sft-linux-gnueabi/cross/arm-mv5sft-linux-gnueabi/sys-root/usr/lib"

./configure --host=${CROSS_COMPILE} --target=${CROSS_COMPILE} --build=i686-pc-linux \
		   CC=${CROSS_COMPILE}-gcc \
		   CPPFLAGS="-I${TOP_ROOT}/include -I${ToolChainInclude}" \
		   LDFLAGS="-L${TOP_ROOT}/lib -L${ToolChainLib}" \
		   --enable-shared=yes \
		   --enable-static=no \
		   --prefix=`pwd`/install \
#--with-libxml-prefix=${TOP_ROOT} \
#		   --with-libxml-include-prefix=${TOP_ROOT}/include/libxml2 \
#		   --with-libxml-libs-prefix=${TOP_ROOT}/lib \
