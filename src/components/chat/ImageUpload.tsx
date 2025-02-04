'use client';

import Image from 'next/image';

import { useState } from 'react';
import { ImageIcon } from 'lucide-react';
import { useMutation } from '@tanstack/react-query';
import { CldUploadWidget, CloudinaryUploadWidgetInfo } from 'next-cloudinary';

import { sendMessage as sendMessageAction } from '@/actions/message.action';

import { useSelectedUser } from '@/store/selected-user';

import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '../ui/dialog';
import { Button } from '../ui/button';

interface ImageUploadProps {
  canSendImage: boolean;
}

export default function ImageUpload({ canSendImage }: ImageUploadProps) {
  const [imageUrl, setImageUrl] = useState('');

  const selectedUser = useSelectedUser(state => state.selectedUser);

  const { mutate: sendMessage } = useMutation({
    mutationKey: ['sendMessage'],
    mutationFn: sendMessageAction,
    onSuccess: () => {
      setImageUrl('');
    },
  });

  return (
    <>
      {canSendImage && (
        <CldUploadWidget
          signatureEndpoint="/api/sign-cloudinary-params"
          onSuccess={(result, { widget }) => {
            setImageUrl((result.info as CloudinaryUploadWidgetInfo).secure_url);
            widget.close();
          }}
        >
          {({ open }) => {
            return (
              <ImageIcon
                size={20}
                onClick={() => open()}
                className="cursor-pointer text-muted-foreground"
              />
            );
          }}
        </CldUploadWidget>
      )}

      <Dialog open={!!imageUrl}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Image Preview</DialogTitle>
          </DialogHeader>

          <div className="flex justify-center items-center relative h-96 w-full mx-auto">
            <Image
              src={imageUrl}
              alt="Image Preview"
              fill
              className="object-contain"
            />
          </div>

          <DialogFooter>
            <Button
              type="submit"
              onClick={() => {
                sendMessage({
                  content: imageUrl,
                  messageType: 'image',
                  receiverId: selectedUser!.id,
                });
              }}
            >
              Send
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
