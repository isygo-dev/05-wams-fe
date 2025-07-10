import React, { useState } from 'react';
import { IconButton, Tooltip, CircularProgress } from '@mui/material';
import Icon from 'template-shared/@core/components/icon';
import { useMutation, useQueryClient, useQuery } from 'react-query';
import toast from 'react-hot-toast';
import { toggleTemplatePin, checkPinStatus } from "../../../api/FavoriteTemplate";
import {useTranslation} from "react-i18next";


interface PinIconProps {
  templateId: number;
  isPinned?: boolean;
  onToggle?: (newStatus: boolean) => void;
  size?: 'small' | 'medium' | 'large';
  tooltipPlacement?: 'top' | 'bottom' | 'left' | 'right';
}

const PinIcon: React.FC<PinIconProps> = ({ templateId, size = 'small' }) => {
  const queryClient = useQueryClient();
  const [isHovered, setIsHovered] = useState(false);
  const {t} = useTranslation()

  const { data: isPinned, isLoading, isError } = useQuery<boolean, Error>(
    ['templatePinStatus', templateId],
    () => checkPinStatus(templateId),
    {
      staleTime: 5 * 60 * 1000,
      cacheTime: 10 * 60 * 1000,
      onError: (error) => {
        toast.error(`Erreur: ${error.message || t('Impossible de vérifier l\'état du pin')}`);
      }
    }
  );

  const pinMutation = useMutation(toggleTemplatePin, {
    onMutate: async () => {
      await queryClient.cancelQueries(['templatePinStatus', templateId]);
      const previousStatus = isPinned;
      queryClient.setQueryData(['templatePinStatus', templateId], !isPinned);

      return { previousStatus };
    },
    onError: (error: Error, _, context) => {
      queryClient.setQueryData(['templatePinStatus', templateId], context?.previousStatus);
      toast.error(`Erreur: ${error.message || t('Échec de la modification du pin')}`);
    },
    onSuccess: (_, __, context) => {
      const newStatus = !context?.previousStatus;
      toast.success(newStatus ? t('Template épinglé avec succès') : t('Template désépinglé avec succès'));
    },
    onSettled: () => {
      queryClient.invalidateQueries(['templatePinStatus', templateId]);
    }
  });

  const handleClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    pinMutation.mutate(templateId);
  };

  if (isError) return null;

  return (
    <Tooltip title={isPinned ? t("Désépingler") : t("Épingler")} arrow>
      <div style={{ position: 'relative' }}>

          <IconButton
          size={size}
          onClick={handleClick}
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
          disabled={isLoading || pinMutation.isLoading}
          sx={{
            color: isPinned ? 'warning.main' : isHovered ? 'warning.light' : 'text.secondary',
            transition: 'all 0.2s ease',
            transform: isPinned || isHovered ? 'scale(1.1)' : 'scale(1)',
            '&:hover': {
              backgroundColor: 'transparent'
            }
          }}
        >
          <Icon
            icon={isPinned ? 'mdi:pin' : isHovered ? 'mdi:pin' : 'mdi:pin-outline'}
            fontSize={size === 'large' ? 24 : size === 'medium' ? 20 : 18}
          />
        </IconButton>
        {(isLoading || pinMutation.isLoading) && (
          <CircularProgress
            size={size === 'large' ? 36 : size === 'medium' ? 30 : 24}
            sx={{
              position: 'absolute',
              top: '50%',
              left: '50%',
              marginTop: size === 'large' ? '-18px' : size === 'medium' ? '-15px' : '-12px',
              marginLeft: size === 'large' ? '-18px' : size === 'medium' ? '-15px' : '-12px',
              color: 'warning.main'
            }}
          />
        )}
      </div>
    </Tooltip>
  );
};

export default PinIcon;
