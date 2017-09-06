/*
 * This file Copyright (C) 2010-2014 Mnemosyne LLC
 *
 * It may be used under the GNU GPL versions 2 or 3
 * or any future license endorsed by Mnemosyne LLC.
 *
 * $Id: tracker-model-filter.h,v 1.1.1.1 2014/09/22 04:10:19 bcmac Exp $
 */

#ifndef QTR_TRACKER_MODEL_FILTER_H
#define QTR_TRACKER_MODEL_FILTER_H

#include <QSortFilterProxyModel>

class TrackerModelFilter : public QSortFilterProxyModel
{
    Q_OBJECT

  public:
    TrackerModelFilter (QObject *parent = 0);

  public:
    void setShowBackupTrackers (bool);
    bool showBackupTrackers () const { return myShowBackups; }

  protected:
    bool filterAcceptsRow (int sourceRow, const QModelIndex&sourceParent) const;

  private:
    bool myShowBackups;
};

#endif
