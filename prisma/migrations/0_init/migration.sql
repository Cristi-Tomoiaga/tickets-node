BEGIN TRY

BEGIN TRAN;

-- CreateTable
CREATE TABLE [dbo].[customer] (
    [customer_id] INT NOT NULL IDENTITY(1,1),
    [customer_name] VARCHAR(100),
    [email] VARCHAR(70),
    CONSTRAINT [PK__customer__CD65CB85FDE8332A] PRIMARY KEY CLUSTERED ([customer_id]),
    CONSTRAINT [uq_email] UNIQUE NONCLUSTERED ([email])
);

-- CreateTable
CREATE TABLE [dbo].[event] (
    [event_id] INT NOT NULL IDENTITY(1,1),
    [venue_id] INT,
    [event_type_id] INT,
    [event_description] VARCHAR(200),
    [event_name] VARCHAR(100),
    [start_date] DATETIME,
    [end_date] DATETIME,
    [image_url] VARCHAR(2000),
    [available_seats] INT,
    CONSTRAINT [PK__event__2370F7276F7B9EED] PRIMARY KEY CLUSTERED ([event_id]),
    CONSTRAINT [uq_event_name_start_date] UNIQUE NONCLUSTERED ([event_name],[start_date])
);

-- CreateTable
CREATE TABLE [dbo].[event_type] (
    [event_type_id] INT NOT NULL IDENTITY(1,1),
    [event_type_name] VARCHAR(100),
    CONSTRAINT [PK__event_ty__BB84C6F389567CC6] PRIMARY KEY CLUSTERED ([event_type_id]),
    CONSTRAINT [uq_event_type_name] UNIQUE NONCLUSTERED ([event_type_name])
);

-- CreateTable
CREATE TABLE [dbo].[orders] (
    [order_id] INT NOT NULL IDENTITY(1,1),
    [ticket_category_id] INT,
    [customer_id] INT,
    [ordered_at] DATETIME,
    [number_of_tickets] INT,
    [total_price] DECIMAL(10,2),
    CONSTRAINT [PK__orders__465962295B15D1F2] PRIMARY KEY CLUSTERED ([order_id])
);

-- CreateTable
CREATE TABLE [dbo].[ticket_category] (
    [ticket_category_id] INT NOT NULL IDENTITY(1,1),
    [event_id] INT,
    [description] VARCHAR(70),
    [price] DECIMAL(10,2),
    CONSTRAINT [PK__ticket_c__3FC8DEA29C94F233] PRIMARY KEY CLUSTERED ([ticket_category_id])
);

-- CreateTable
CREATE TABLE [dbo].[venue] (
    [venue_id] INT NOT NULL IDENTITY(1,1),
    [location] VARCHAR(70),
    [type] VARCHAR(100),
    [capacity] INT,
    CONSTRAINT [PK__venue__82A8BE8DBFE4F0A4] PRIMARY KEY CLUSTERED ([venue_id])
);

-- AddForeignKey
ALTER TABLE [dbo].[event] ADD CONSTRAINT [fk_event_event_type] FOREIGN KEY ([event_type_id]) REFERENCES [dbo].[event_type]([event_type_id]) ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE [dbo].[event] ADD CONSTRAINT [fk_event_venue] FOREIGN KEY ([venue_id]) REFERENCES [dbo].[venue]([venue_id]) ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE [dbo].[orders] ADD CONSTRAINT [fk_orders_customer] FOREIGN KEY ([customer_id]) REFERENCES [dbo].[customer]([customer_id]) ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE [dbo].[orders] ADD CONSTRAINT [fk_orders_ticket_category] FOREIGN KEY ([ticket_category_id]) REFERENCES [dbo].[ticket_category]([ticket_category_id]) ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE [dbo].[ticket_category] ADD CONSTRAINT [fk_ticket_category_event] FOREIGN KEY ([event_id]) REFERENCES [dbo].[event]([event_id]) ON DELETE NO ACTION ON UPDATE NO ACTION;

COMMIT TRAN;

END TRY
BEGIN CATCH

IF @@TRANCOUNT > 0
BEGIN
    ROLLBACK TRAN;
END;
THROW

END CATCH

