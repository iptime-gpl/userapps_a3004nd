#!/bin/sh
JS_DIR=~/userapps/cgi-src/iuxpc/js/
JS_LANG_DIR=~/userapps/cgi-src/iuxpc/js/langpack
MIN_DIR=min

rm -rf ${JS_DIR}${MIN_DIR}
mkdir ${JS_DIR}${MIN_DIR}

cd $JS_DIR
for JSFILE in *.js; do
	if ! [[ -s $JSFILE ]]; then
		continue
	fi

	UGLIFIED=`sed '/<.\?script/d' "$JSFILE" | uglifyjs`
	echo "<script>" > $MIN_DIR/"$JSFILE"
	echo $UGLIFIED >> $MIN_DIR/"$JSFILE"
	echo "</script>" >> $MIN_DIR/"$JSFILE"
done

for LANG in $*; do
	if ! [[ -d $JS_LANG_DIR/"$LANG" ]]; then
		continue
	fi

	cd $JS_LANG_DIR/$LANG
	rm -rf $MIN_DIR
	mkdir $MIN_DIR

	for LANGFILE in *.js; do
		if ! [[ -s $LANGFILE ]]; then
			continue
		fi

		UGLIFIED=`sed '/<.\?script/d' "$LANGFILE" | uglifyjs`
		echo "<script>" > $MIN_DIR/"$LANGFILE"
		echo $UGLIFIED >> $MIN_DIR/"$LANGFILE"
		echo "</script>" >> $MIN_DIR/"$LANGFILE"
	done
done
