import React, { useEffect } from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import moment from 'moment';
import Persona from '../Persona/Persona';
import styles from './style';
import { useSelector } from 'react-redux';
import { RootState } from '../../../redux/rootReducer';
import { fetchImage } from '../../../backend/RequestAPI';
import { useFetchSettings } from '../../../hooks/useRequests';

const statusColors = {
  open: '#ffebc9',
  resolved: '#bfeec9ff',
  closed: '#d9d9d9ff',
  reopened: '#fcb2b9ff',
};

interface TicketCardProps {
  ticketNumber: string;
  department?: string;
  status: 'open' | 'resolved' | 'closed' | 'reopened' | string;
  date: string | Date;
  subtitle?: string;
  description?: string;
  assignee?: string;
  priority?: string;
  reporter?: string;
  item: any;
  onPress?: () => void;
}


const TicketCard: React.FC<TicketCardProps> = ({
  ticketNumber,
  department,
  status,
  date,
  subtitle,
  description,
  assignee,
  priority,
  reporter,
  item,
  onPress,
}) => {
  const { data: settings, isLoading, isError, refetch } = useFetchSettings();
  const siteURL = useSelector((state: RootState) => state?.login?.tanent);
  const stripHtml = (html: string) => {
    return html?.replace(/<\/?[^>]+(>|$)/g, "");
  };
  return (
    <TouchableOpacity onPress={onPress} activeOpacity={0.7}>
      <View style={styles.card}>
        <View style={styles.row}>
          <View style={styles.rowItem}>
            <Text style={styles.ticketNumber} numberOfLines={1} ellipsizeMode="tail">
              {ticketNumber}
            </Text>
          </View>
          <View style={styles.rowItem}>
            <Text style={styles.department}>
              {JSON.parse(item?.TicketProperties)?.[0]?.DepartmentCode}
            </Text>
          </View>
          <View style={styles.rowItem}>
            <View
              style={[
                styles.statusContainer,
                { backgroundColor: statusColors?.[status?.toLowerCase()] || '#ffebc9' },
              ]}
            >
              <Text style={styles.statusText} numberOfLines={1} ellipsizeMode="tail">
                {status}
              </Text>
            </View>
          </View>
          <View style={styles.rowItem}>
            <Text style={styles.date} numberOfLines={1} ellipsizeMode="tail">
              {moment(date)?.format(settings?.Dateformat || 'MM/DD/YYYY')}
            </Text>
          </View>
        </View>

        {subtitle ? (
          <Text style={styles.subtitle} numberOfLines={1} ellipsizeMode="tail">
            {subtitle}
          </Text>
        ) : null}

        {description ? (
          <Text
            style={styles.description}
            numberOfLines={1}
            ellipsizeMode="tail"
          >
            {stripHtml(description)}
          </Text>
        ) : null}

        <View style={styles.row}>
          {reporter ? (
            <View style={styles.rowItem}>
              <Persona
                name={reporter}
                mail={item?.RequesterEmail}
              />
            </View>
          ) : <View style={styles.rowItem} />}

          {priority ? (
            <View style={styles.rowItem}>
              <Text style={styles.infoText} numberOfLines={1} ellipsizeMode="tail">
                {priority}
              </Text>
            </View>
          ) : <View style={styles.rowItem} />}

          {assignee ? (
            <View style={styles.rowItem}>
              <Persona
                name={assignee}
                mail={item?.AssignedTomail}
              />
            </View>
          ) : <View style={styles.rowItem} />}
        </View>
      </View>
    </TouchableOpacity>
  );
};

export default TicketCard;