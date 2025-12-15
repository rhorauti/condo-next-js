'use client';

import { useId, useRef, useState, useEffect } from 'react';
import { Button } from '../ui/button';
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '../ui/dialog';
import { IPost } from '@/interfaces/post.interface';
import z from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Card, CardContent, CardFooter, CardHeader } from '../ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar';
import { ImageIcon, MapPin, Smile, User, X, Plus } from 'lucide-react';
import { Textarea } from '../ui/textarea';
import { toast } from 'sonner';
import { ScrollArea, ScrollBar } from '../ui/scroll-area';

interface IProps {
  showDialog: boolean;
  postInfo?: IPost; // Made optional since you might be creating new posts
  onCloseDialog: () => void;
}

// --- CONSTANTS ---
const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB
const MAX_FILES = 5; // Limit max files
const ACCEPTED_IMAGE_TYPES = [
  'image/jpeg',
  'image/jpg',
  'image/png',
  'image/webp',
];

// --- SCHEMA ---
const postSchema = z
  .object({
    content: z.string().optional(),
    media: z
      .array(z.instanceof(File)) // Changed to Array of Files
      .refine(
        (files) => files.length <= MAX_FILES,
        `You can only upload up to ${MAX_FILES} photos.`
      )
      .refine(
        (files) => files.every((file) => file.size <= MAX_FILE_SIZE),
        `Each file must be less than 10MB.`
      )
      .refine(
        (files) =>
          files.every((file) => ACCEPTED_IMAGE_TYPES.includes(file.type)),
        'Only .jpg, .png, and .webp formats are supported.'
      )
      .optional(),
  })
  .refine(
    (data) => {
      const hasText = data.content && data.content.trim().length > 0;
      const hasFile = data.media && data.media.length > 0;
      return hasText || hasFile;
    },
    {
      message: 'Please write something or add a photo.',
      path: ['content'],
    }
  );

type PostFormValues = z.infer<typeof postSchema>;

export function PostFormDialog({
  showDialog,
  postInfo,
  onCloseDialog,
}: IProps) {
  const formId = useId();

  // --- STATE FOR MULTI-FILES ---
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [previewUrls, setPreviewUrls] = useState<string[]>([]);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const form = useForm<PostFormValues>({
    resolver: zodResolver(postSchema),
    defaultValues: {
      content: '',
      media: [],
    },
  });

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors, isSubmitting },
  } = form;

  // Cleanup URLs to prevent memory leaks
  useEffect(() => {
    return () => {
      previewUrls.forEach((url) => URL.revokeObjectURL(url));
    };
  }, []); // Only runs on unmount

  // --- HANDLERS ---
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      const newFiles = Array.from(files);
      const combinedFiles = [...selectedFiles, ...newFiles];

      // Update State & Previews
      setSelectedFiles(combinedFiles);

      const newPreviews = newFiles.map((file) => URL.createObjectURL(file));
      setPreviewUrls((prev) => [...prev, ...newPreviews]);

      // Sync with React Hook Form
      setValue('media', combinedFiles, { shouldValidate: true });
    }
    // Reset input to allow selecting the same file again if needed
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const removeImage = (indexToRemove: number) => {
    URL.revokeObjectURL(previewUrls[indexToRemove]);

    const updatedFiles = selectedFiles.filter((_, i) => i !== indexToRemove);
    const updatedPreviews = previewUrls.filter((_, i) => i !== indexToRemove);

    setSelectedFiles(updatedFiles);
    setPreviewUrls(updatedPreviews);
    setValue('media', updatedFiles, { shouldValidate: true });
  };

  const onSubmit = async (data: PostFormValues) => {
    const formData = new FormData();
    formData.append('content', data.content || '');

    // Append all files
    if (data.media) {
      data.media.forEach((file) => {
        formData.append('files', file);
      });
    }

    // Simulate API Call
    await new Promise((resolve) => setTimeout(resolve, 2000));

    console.log('Submitted Files:', data.media?.length);
    toast.success('Post created successfully!');

    handleClose();
  };

  const handleClose = () => {
    form.reset();
    setSelectedFiles([]);
    setPreviewUrls([]);
    onCloseDialog();
  };

  return (
    <Dialog open={showDialog} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-[500px] p-0 gap-0 overflow-hidden bg-transparent border-none shadow-none">
        {/* We use a single Card as the content container */}
        <Card className="w-full shadow-md border-border/60">
          <DialogHeader className="px-6 pt-6 pb-2">
            <div className="flex items-center justify-between">
              <DialogTitle>Create Post</DialogTitle>
              <DialogClose asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8 rounded-full"
                >
                  <X className="h-4 w-4" />
                </Button>
              </DialogClose>
            </div>
          </DialogHeader>

          <CardHeader className="pb-3 px-6">
            <div className="flex items-center gap-3">
              <Avatar className="h-10 w-10 cursor-pointer hover:opacity-90 transition">
                <AvatarImage src="https://github.com/shadcn.png" />
                <AvatarFallback>CN</AvatarFallback>
              </Avatar>
              <div>
                <p className="text-sm font-semibold leading-none">
                  Rafael Horauti
                </p>
                <Button
                  variant="secondary"
                  size="sm"
                  className="h-5 text-[10px] px-2 mt-1 bg-muted-foreground/10 text-muted-foreground hover:bg-muted-foreground/20"
                >
                  Public <User className="ml-1 h-3 w-3" />
                </Button>
              </div>
            </div>
          </CardHeader>

          <CardContent className="pb-2 px-6">
            <form id={`form-${formId}`} onSubmit={handleSubmit(onSubmit)}>
              {/* Text Input */}
              <Textarea
                {...register('content')}
                placeholder="What's on your mind, Rafael?"
                className="min-h-[80px] text-lg border-none focus-visible:ring-0 resize-none px-0 py-2 placeholder:text-muted-foreground/70"
              />

              {/* Multi-Image Preview Scroll Area */}
              {previewUrls.length > 0 && (
                <ScrollArea className="w-full whitespace-nowrap rounded-md border mt-2">
                  <div className="flex w-max space-x-4 p-4">
                    {previewUrls.map((url, index) => (
                      <div
                        key={url}
                        className="relative aspect-square h-40 w-40 shrink-0 overflow-hidden rounded-md border bg-muted"
                      >
                        <img
                          src={url}
                          alt={`Preview ${index}`}
                          className="h-full w-full object-cover"
                        />
                        <Button
                          type="button"
                          variant="destructive"
                          size="icon"
                          className="absolute top-1 right-1 h-6 w-6 rounded-full opacity-80 hover:opacity-100 shadow-sm"
                          onClick={() => removeImage(index)}
                        >
                          <X className="h-3 w-3" />
                        </Button>
                      </div>
                    ))}

                    {/* "Add More" Button inside scroll area */}
                    {selectedFiles.length < MAX_FILES && (
                      <div
                        onClick={() => fileInputRef.current?.click()}
                        className="flex h-40 w-24 shrink-0 cursor-pointer flex-col items-center justify-center gap-2 rounded-md border border-dashed bg-muted/20 hover:bg-muted/40 transition-colors"
                      >
                        <Plus className="h-8 w-8 text-muted-foreground" />
                        <span className="text-xs text-muted-foreground">
                          Add
                        </span>
                      </div>
                    )}
                  </div>
                  <ScrollBar orientation="horizontal" />
                </ScrollArea>
              )}

              {/* Hidden File Input */}
              <input
                type="file"
                multiple // ALLOWS MULTIPLE FILES
                accept="image/*"
                className="hidden"
                ref={(e) => {
                  register('media'); // Link RHF
                  fileInputRef.current = e; // Link manual ref
                }}
                onChange={handleFileChange}
              />

              {/* Error Messages */}
              {errors.content && (
                <p className="text-destructive text-sm mt-2">
                  {errors.content.message}
                </p>
              )}
              {errors.media && (
                <p className="text-destructive text-sm mt-2">
                  {errors.media.message as string}
                </p>
              )}
            </form>
          </CardContent>

          <div className="px-6 mt-2">
            <div className="border rounded-lg p-3 flex items-center justify-between shadow-sm">
              <span className="text-sm font-semibold text-muted-foreground cursor-default">
                Add to your post
              </span>
              <div className="flex gap-1">
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  className="text-green-600 hover:bg-green-50 hover:text-green-700"
                  onClick={() => fileInputRef.current?.click()}
                >
                  <ImageIcon className="h-5 w-5" />
                </Button>
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  className="text-blue-600 hover:bg-blue-50 hover:text-blue-700"
                >
                  <User className="h-5 w-5" />
                </Button>
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  className="text-yellow-600 hover:bg-yellow-50 hover:text-yellow-700"
                >
                  <Smile className="h-5 w-5" />
                </Button>
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  className="text-red-600 hover:bg-red-50 hover:text-red-700"
                >
                  <MapPin className="h-5 w-5" />
                </Button>
              </div>
            </div>
          </div>

          <CardFooter className="pt-4 px-6 pb-6">
            <Button
              type="submit"
              form={`form-${formId}`}
              className="w-full font-semibold"
              disabled={
                isSubmitting ||
                (!watch('content') && selectedFiles.length === 0)
              }
            >
              {isSubmitting ? 'Posting...' : 'Post'}
            </Button>
          </CardFooter>
        </Card>
      </DialogContent>
    </Dialog>
  );
}
