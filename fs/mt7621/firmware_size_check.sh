#!/bin/sh
if [ $# -lt 2 ]; then
	echo "====================================================================="
	echo "ERROR, arguments are not given"
	echo "====================================================================="
	exit 1
fi
FIRMWARE_NAME="$1"
if ! [ -f $FIRMWARE_NAME ]; then
	echo "====================================================================="
	echo "ERROR, ${FIRMWARE_NAME} does not exist"
	echo "====================================================================="
	exit 1
fi
if [[ $2 == 0x* ]]; then
	MAX_FIRMWARE_SIZE=`printf "%d" ${2}`
else
	MAX_FIRMWARE_SIZE=`printf "%d" 0x${2}`
fi
if [ "$MAX_FIRMWARE_SIZE" == "" ]; then
	echo "====================================================================="
	echo "ERROR, cannot read max firmware size"
	echo "====================================================================="
	exit 1
fi
FIRMWARE_SIZE=`ls -l ${FIRMWARE_NAME} | awk '{print $5}'`
echo ""
echo "MAX Firmware Size : ${MAX_FIRMWARE_SIZE}"
echo "Firmware Size : ${FIRMWARE_SIZE}"
if [ $MAX_FIRMWARE_SIZE -ge $FIRMWARE_SIZE ]; then
	echo "Free size : $(($MAX_FIRMWARE_SIZE - $FIRMWARE_SIZE))"
	exit 0
fi
echo "====================================================================="
echo "ERROR, Firmware size exceeded the limit "
#rm "${FIRMWARE_NAME}"
echo "====================================================================="
exit 1
