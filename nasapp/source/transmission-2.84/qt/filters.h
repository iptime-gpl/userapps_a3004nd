/*
 * This file Copyright (C) 2010-2014 Mnemosyne LLC
 *
 * It may be used under the GNU GPL versions 2 or 3
 * or any future license endorsed by Mnemosyne LLC.
 *
 * $Id: filters.h,v 1.1.1.1 2014/09/22 04:10:19 bcmac Exp $
 */

#ifndef QTR_FILTERS_H
#define QTR_FILTERS_H

#include <QMetaType>
#include <QString>
#include <QVariant>

class FilterMode
{
  private:
    int myMode;

  public:
    FilterMode( int mode=SHOW_ALL ): myMode(mode) {}
    FilterMode( const QString& name ): myMode(modeFromName(name)) {}
    static const QString names[];
    enum { SHOW_ALL, SHOW_ACTIVE, SHOW_DOWNLOADING, SHOW_SEEDING, SHOW_PAUSED,
           SHOW_FINISHED, SHOW_VERIFYING, SHOW_ERROR, NUM_MODES };
    static int modeFromName( const QString& name );
    static const QString& nameFromMode( int mode ) { return names[mode]; }
    int mode() const { return myMode; }
    const QString& name() const { return names[myMode]; }
};

class SortMode
{
  private:
    int myMode;

  public:
    SortMode( int mode=SORT_BY_ID ): myMode(mode) {}
    SortMode( const QString& name ): myMode(modeFromName(name)) {}
    static const QString names[];
    enum { SORT_BY_ACTIVITY, SORT_BY_AGE, SORT_BY_ETA, SORT_BY_NAME,
           SORT_BY_PROGRESS, SORT_BY_QUEUE, SORT_BY_RATIO, SORT_BY_SIZE,
           SORT_BY_STATE, SORT_BY_ID, NUM_MODES };
    static int modeFromName( const QString& name );
    static const QString& nameFromMode( int mode );
    int mode() const { return myMode; }
    const QString& name() const { return names[myMode]; }
};

Q_DECLARE_METATYPE(FilterMode)
Q_DECLARE_METATYPE(SortMode)

#endif
